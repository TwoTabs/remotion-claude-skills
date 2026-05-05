import React from 'react';
import { Composition } from 'remotion';
import './index.css';
import { VideoComposition as TodomvcVideo } from './flows/todomvc-walkthrough/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as TODOMVC_FRAMES } from './flows/todomvc-walkthrough/data/flow';
import { VideoComposition as SaucedemoVideo } from './flows/saucedemo-checkout/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as SAUCEDEMO_FRAMES } from './flows/saucedemo-checkout/data/flow';
import { VideoComposition as AeProductVideo } from './flows/automationexercise-product-detail/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as AE_PRODUCT_FRAMES } from './flows/automationexercise-product-detail/data/flow';
import { SprintTodosComposition } from './flows/todomvc-sprint-todos/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as SPRINT_TODOS_FRAMES } from './flows/todomvc-sprint-todos/data/flow';
import { VideoComposition as CreateLinearIssueVideo } from './flows/create-linear-issue/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as CREATE_LINEAR_ISSUE_FRAMES } from './flows/create-linear-issue/data/flow';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TodomvcWalkthrough"
        component={TodomvcVideo}
        durationInFrames={TODOMVC_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SaucedemoCheckout"
        component={SaucedemoVideo}
        durationInFrames={SAUCEDEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AutomationExerciseProductDetail"
        component={AeProductVideo}
        durationInFrames={AE_PRODUCT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TodomvcSprintTodos"
        component={SprintTodosComposition}
        durationInFrames={SPRINT_TODOS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CreateLinearIssue"
        component={CreateLinearIssueVideo}
        durationInFrames={CREATE_LINEAR_ISSUE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
