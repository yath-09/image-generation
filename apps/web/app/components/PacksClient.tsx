"use client";

import { useState } from "react";
import { SelectModel } from "./Models";
import { PackCard, TPack } from "./PackCard";

export function PacksClient({ packs, loading }: { packs: TPack[]; loading: boolean }) {
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>();

  return (
      <div className="flex justify-center">
          <div className="pt-4 max-w-2xl w-full">
              <SelectModel selectedModel={selectedModelId} setSelectedModel={setSelectedModelId} />

              <h2 className="text-2xl font-semibold pt-4">Select Pack</h2>

              {loading ? (
                  <div className="text-center text-gray-500">Loading packs...</div>
              ) : packs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                      {packs.map((pack) => (
                          <PackCard key={pack.id} selectedModelId={selectedModelId || ""} {...pack} />
                      ))}
                  </div>
              ) : (
                  <div className="text-center text-gray-500">No packs available.</div>
              )}
          </div>
      </div>
  );
}

