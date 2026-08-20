import React from 'react';
import { Cpu } from 'lucide-react';

export default function DSABadge({ algorithm, executionTimeMs }) {
  if (!algorithm) return null;

  return (
    <span className="dsa-badge" title={`Execution time: ${executionTimeMs || 0}ms`}>
      <Cpu size={12} />
      {algorithm}
      {executionTimeMs !== undefined && (
        <span style={{ opacity: 0.8, marginLeft: '3px' }}>({executionTimeMs}ms)</span>
      )}
    </span>
  );
}
