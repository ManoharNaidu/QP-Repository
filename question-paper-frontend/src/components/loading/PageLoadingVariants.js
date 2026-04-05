import React from "react";

import Skeleton from "../ui/Skeleton";

const SkeletonField = ({ compact = false }) => (
  <div className="space-y-2">
    <Skeleton variant="text" className="h-3 w-24" />
    <Skeleton className={compact ? "h-11 w-full rounded" : "h-12 w-full rounded-DEFAULT"} />
  </div>
);

const SkeletonInfoRow = () => (
  <div className="flex items-start gap-4">
    <Skeleton variant="circle" className="mt-1 h-10 w-10 rounded" />
    <div className="flex-1 space-y-2.5">
      <Skeleton variant="text" className="h-4 w-32" />
      <Skeleton variant="text" className="h-3 w-52 max-w-full" />
    </div>
  </div>
);

export const DownloadResultsLoading = () => (
  <div className="space-y-6" role="status" aria-live="polite">
    <Skeleton className="h-14 w-full rounded-lg" />
    <Skeleton variant="text" className="h-4 w-32" />

    <div className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low">
      <div className="grid min-w-[600px] grid-cols-[2.2fr,0.8fr,0.9fr,0.9fr,1fr] gap-0 border-b border-outline-variant/30 bg-surface-container-high whitespace-nowrap">
        {[180, 70, 80, 90, 90].map((width, index) => (
          <div key={index} className="px-6 py-4">
            <Skeleton variant="text" className="h-3" style={{ width }} />
          </div>
        ))}
      </div>

      <div className="divide-y divide-outline-variant/10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid min-w-[600px] grid-cols-[2.2fr,0.8fr,0.9fr,0.9fr,1fr] gap-0 whitespace-nowrap"
          >
            <div className="px-6 py-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-8 rounded" />
                <Skeleton variant="text" className="h-4 w-36 max-w-full" />
              </div>
            </div>
            <div className="px-6 py-5">
              <Skeleton variant="text" className="h-4 w-14" />
            </div>
            <div className="px-6 py-5">
              <Skeleton variant="text" className="h-4 w-16" />
            </div>
            <div className="px-6 py-5">
              <Skeleton variant="text" className="h-4 w-16" />
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-end">
                <Skeleton className="h-9 w-28 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-outline-variant/20 pt-8">
      <Skeleton className="h-10 w-28 rounded" />
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant="circle" className="h-8 w-8" />
        ))}
      </div>
      <Skeleton className="h-10 w-24 rounded" />
    </div>
  </div>
);

export const UploadPageLoading = () => (
  <div className="space-y-8" role="status" aria-live="polite">
    <div className="space-y-6">
      <SkeletonField />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SkeletonField />
        <SkeletonField />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
      </div>

      <SkeletonField />

      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-32" />
        <div className="rounded-DEFAULT border-2 border-dashed border-outline-variant bg-surface-container-low p-12">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton variant="circle" className="h-12 w-12" />
            <Skeleton variant="text" className="h-4 w-56 max-w-full" />
            <Skeleton variant="text" className="h-3 w-64 max-w-full" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Skeleton className="h-14 w-full rounded-DEFAULT" />
        <div className="mt-6 flex justify-center">
          <Skeleton variant="text" className="h-3 w-56" />
        </div>
      </div>
    </div>
  </div>
);

export const FeedbackPageLoading = () => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" role="status" aria-live="polite">
    <div className="lg:col-span-5">
      <Skeleton variant="text" className="mb-4 h-3 w-28" />
      <div className="space-y-4">
        <Skeleton variant="text" className="h-12 w-72 max-w-full" />
        <Skeleton variant="text" className="h-12 w-60 max-w-full" />
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton variant="text" className="h-4 w-full max-w-md" />
        <Skeleton variant="text" className="h-4 w-11/12 max-w-md" />
        <Skeleton variant="text" className="h-4 w-4/5 max-w-md" />
      </div>

      <div className="mt-12 space-y-6">
        <SkeletonInfoRow />
        <SkeletonInfoRow />
      </div>
    </div>

    <div className="lg:col-span-7">
      <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-8 md:p-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <SkeletonField compact />
            <SkeletonField compact />
          </div>

          <SkeletonField compact />

          <div className="space-y-2">
            <Skeleton variant="text" className="h-3 w-28" />
            <Skeleton className="h-36 w-full rounded" />
          </div>

          <div className="flex justify-end pt-4">
            <Skeleton className="h-14 w-48 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-12 justify-center lg:justify-start">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton variant="circle" className="h-4 w-4" />
            <Skeleton variant="text" className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
