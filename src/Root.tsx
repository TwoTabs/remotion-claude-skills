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
import { VideoComposition as AirtableForecastsVideo } from './flows/airtable-main-feature-demo/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as AIRTABLE_FORECASTS_FRAMES } from './flows/airtable-main-feature-demo/data/flow';
import { VideoComposition as AirtableItSupportFormVideo } from './flows/airtable-it-support-form/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as AIRTABLE_IT_SUPPORT_FRAMES } from './flows/airtable-it-support-form/data/flow';
import { VideoComposition as AirtableInterfaceFiltersVideo } from './flows/airtable-interface-filters/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as AIRTABLE_INTERFACE_FILTERS_FRAMES } from './flows/airtable-interface-filters/data/flow';
import { VideoComposition as AirtableFiltersDetailTourVideo } from './flows/airtable-filters-detail-tour/remotion/VideoComposition';
import { TOTAL_DURATION_FRAMES as AIRTABLE_FILTERS_DETAIL_TOUR_FRAMES } from './flows/airtable-filters-detail-tour/data/flow';
import { VideoComposition as FtwVideoEdit } from './flows/ftw-video-edit/VideoComposition';
import { TOTAL_DURATION_FRAMES as FTW_EDIT_FRAMES } from './flows/ftw-video-edit/data';

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
      <Composition
        id="AirtableForecasts"
        component={AirtableForecastsVideo}
        durationInFrames={AIRTABLE_FORECASTS_FRAMES}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="AirtableItSupportForm"
        component={AirtableItSupportFormVideo}
        durationInFrames={AIRTABLE_IT_SUPPORT_FRAMES}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="AirtableInterfaceFilters"
        component={AirtableInterfaceFiltersVideo}
        durationInFrames={AIRTABLE_INTERFACE_FILTERS_FRAMES}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="AirtableFiltersDetailTour"
        component={AirtableFiltersDetailTourVideo}
        durationInFrames={AIRTABLE_FILTERS_DETAIL_TOUR_FRAMES}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="FtwVideoEdit"
        component={FtwVideoEdit}
        durationInFrames={FTW_EDIT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
