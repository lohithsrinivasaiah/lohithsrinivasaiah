import { portfolio } from '@/data';

export function About() {
  const { about } = portfolio;
  const { bio } = about;

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white mb-4">About</h2>

      {/* Bio Section */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 md:p-6">
        <div className="prose prose-invert max-w-none">
          {bio.map((paragraph, i) => (
            <p key={i} className={`text-sm text-[#c9d1d9] leading-relaxed ${i < bio.length - 1 ? 'mb-4' : ''}`}>
              {paragraph.split(portfolio.profile.name).map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && (
                    <span className="text-white font-mono">{portfolio.profile.name}</span>
                  )}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
