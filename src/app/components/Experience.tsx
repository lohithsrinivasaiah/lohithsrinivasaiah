import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { getExperience } from '@/data';

interface Position {
  id: number;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
  location?: string;
  summary: string;
  technologies: string[];
  type: 'work' | 'education';
}

interface Company {
  id: number;
  name: string;
  logo?: string;
  totalTenure: string;
  positions: Position[];
}

const SUMMARY_TRUNCATE_LENGTH = 150;

const companies: Company[] = getExperience();

function PositionBlock({
  position,
  isLastPosition,
  isCurrent,
}: {
  position: Position;
  isLastPosition: boolean;
  isCurrent: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = position.summary.length > SUMMARY_TRUNCATE_LENGTH;
  const displaySummary = shouldTruncate && !expanded
    ? position.summary.slice(0, SUMMARY_TRUNCATE_LENGTH) + '...'
    : position.summary;

  return (
    <div className="relative flex gap-4 pl-2">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
          position.type === 'work' ? 'bg-[#3fb950]' : 'bg-[#58a6ff]'
        }`} />
        {!isLastPosition && (
          <div className="w-px flex-1 min-h-[20px] bg-[#30363d] mt-1" />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-6">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-mono font-medium">{position.role}</h3>
          {isCurrent && (
            <span className="px-2 py-1 rounded-full text-xs bg-[#238636]/20 text-[#3fb950] shrink-0">
              Current
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#8b949e] mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="size-3 shrink-0" />
            {position.startDate} – {position.endDate} · {position.duration}
          </span>
          {position.location && (
            <>
              <span className="text-[#30363d]">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                {position.location}
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-[#c9d1d9] leading-relaxed mb-3">
          {displaySummary}
          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-[#58a6ff] hover:underline ml-1"
            >
              {expanded ? 'see less' : 'see more'}
            </button>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {position.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-[#1f6feb]/10 text-[#58a6ff] text-xs rounded-md border border-[#1f6feb]/30 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  const [logoLoadErrors, setLogoLoadErrors] = useState<Set<number>>(new Set());
  const totalPositions = companies.reduce((acc, c) => acc + c.positions.length, 0);
  const isFirstPositionOverall = (companyIndex: number, positionIndex: number) =>
    companyIndex === 0 && positionIndex === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-white">Experience</h2>
        <span className="text-sm text-[#8b949e]">{totalPositions} milestones</span>
      </div>

      <div className="space-y-3">
        {companies.map((company, companyIndex) => (
          <div
            key={company.id}
            className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 md:p-4 hover:border-[#58a6ff] transition-colors group"
          >
            {/* Company header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mt-1 shrink-0 overflow-hidden">
                {company.logo && !logoLoadErrors.has(company.id) ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-contain"
                    onError={() => setLogoLoadErrors((prev) => new Set(prev).add(company.id))}
                  />
                ) : (
                  <Briefcase className="size-4 text-[#3fb950]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#58a6ff] hover:underline cursor-pointer font-medium">
                  {company.name}
                </h3>
                <p className="text-sm text-[#8b949e]">{company.totalTenure}</p>
              </div>
            </div>

            {/* Positions timeline */}
            <div className="relative">
              {company.positions.map((position, positionIndex) => (
                <PositionBlock
                  key={position.id}
                  position={position}
                  isLastPosition={positionIndex === company.positions.length - 1}
                  isCurrent={isFirstPositionOverall(companyIndex, positionIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
