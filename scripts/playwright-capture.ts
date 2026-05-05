import { type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface CapturedElement {
  selector: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TimedStep {
  step: number;
  label: string;
  caption: string;
  startMs: number;
  interaction: 'click' | 'fill' | 'select' | 'dblclick' | 'press' | 'none';
  element: CapturedElement | null;
  typedValue?: string;
}

export interface RecordingManifest {
  flowSlug: string;
  capturedAt: string;
  recordingFile: string;
  videoDurationMs: number;
  viewport: { width: number; height: number };
  steps: TimedStep[];
}

export class TutorialCaptureRecording {
  private steps: TimedStep[] = [];
  private stepIndex = 0;
  public t0 = 0;
  private manifestPath: string;

  constructor(private page: Page, private flowSlug: string) {
    const dir = path.join('public', 'recordings', flowSlug);
    fs.mkdirSync(dir, { recursive: true });
    this.manifestPath = path.join(dir, 'manifest.json');
  }

  start(): void {
    this.t0 = Date.now();
  }

  private elapsed(): number {
    return Date.now() - this.t0;
  }

  private async getBox(selector: string, nth: number = 0): Promise<CapturedElement | null> {
    try {
      const locator = this.page.locator(selector).nth(nth);
      await locator.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
      const box = await locator.boundingBox();
      if (!box) return null;
      return { selector: nth > 0 ? `${selector}[nth=${nth}]` : selector, x: box.x, y: box.y, width: box.width, height: box.height };
    } catch {
      return null;
    }
  }

  /** Mark a moment in the recording with an optional element to highlight. */
  async mark(label: string, caption: string, selector?: string, nth: number = 0): Promise<void> {
    const startMs = this.elapsed();
    const element = selector ? await this.getBox(selector, nth) : null;
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'none', element });
  }

  /** Click and record. */
  async click(selector: string, label: string, caption: string, nth: number = 0): Promise<void> {
    const startMs = this.elapsed();
    const element = await this.getBox(selector, nth);
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'click', element });
    await this.page.locator(selector).nth(nth).click();
  }

  /** Double-click and record. */
  async dblclick(selector: string, label: string, caption: string, nth: number = 0): Promise<void> {
    const startMs = this.elapsed();
    const element = await this.getBox(selector, nth);
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'dblclick', element });
    await this.page.locator(selector).nth(nth).dblclick();
  }

  /** Fill a text field. */
  async fill(selector: string, value: string, label: string, caption: string, nth: number = 0): Promise<void> {
    const startMs = this.elapsed();
    const element = await this.getBox(selector, nth);
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'fill', element, typedValue: value });
    await this.page.locator(selector).nth(nth).fill(value);
  }

  /** Select a value in a <select> element. */
  async select(selector: string, value: string, label: string, caption: string, nth: number = 0): Promise<void> {
    const startMs = this.elapsed();
    const element = await this.getBox(selector, nth);
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'select', element, typedValue: value });
    await this.page.locator(selector).nth(nth).selectOption(value);
  }

  /** Press a key on the focused element (e.g. Enter, Tab). */
  async press(key: string, label: string, caption: string, selector?: string, nth: number = 0): Promise<void> {
    const startMs = this.elapsed();
    const element = selector ? await this.getBox(selector, nth) : null;
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'press', element, typedValue: key });
    if (selector) {
      await this.page.locator(selector).nth(nth).press(key);
    } else {
      await this.page.keyboard.press(key);
    }
  }

  /** Type into the currently focused element character by character. */
  async type(text: string, label: string, caption: string, selector?: string): Promise<void> {
    const startMs = this.elapsed();
    const element = selector ? await this.getBox(selector) : null;
    this.steps.push({ step: ++this.stepIndex, label, caption, startMs, interaction: 'fill', element, typedValue: text });
    await this.page.keyboard.type(text);
  }

  /** Write manifest.json after context.close(). */
  async save(recordingWebmPath: string, videoDurationMs: number): Promise<void> {
    const vp = this.page.viewportSize() ?? { width: 1280, height: 720 };
    const manifest: RecordingManifest = {
      flowSlug: this.flowSlug,
      capturedAt: new Date().toISOString(),
      recordingFile: recordingWebmPath,
      videoDurationMs,
      viewport: vp,
      steps: this.steps,
    };
    fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n✅ Recording manifest → ${this.manifestPath}`);
    console.log(`   Video: ${recordingWebmPath}  (${(videoDurationMs / 1000).toFixed(1)}s)`);
    this.steps.forEach(s =>
      console.log(`   Step ${s.step} @${(s.startMs / 1000).toFixed(2)}s: [${s.interaction}] ${s.label}`)
    );
  }
}
