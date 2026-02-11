import React from 'react';

interface Props {
  runId: string;
}

export default function ScreenshotViewer({ runId }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Order Confirmation Screenshot</h3>
      <img
        src={`/api/screenshot/${runId}`}
        alt="Order confirmation screenshot"
        className="w-full rounded border"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
