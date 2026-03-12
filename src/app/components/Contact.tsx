import { Mail, Github, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { portfolio, getIcon } from '@/data';

const { profile, contact } = portfolio;
const { availability, methods: contactMethods, cta } = contact;
const emailMethod = contactMethods.find((m) => m.primary || m.icon === 'Mail');
const githubMethod = contactMethods.find((m) => m.icon === 'Github');

export function Contact() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white mb-4">Contact</h2>

      {/* Availability Card */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-xl">
            {portfolio.profile.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1">Let's Connect!</h3>
            <p className="text-[#c9d1d9] text-sm leading-relaxed">
              I'm always interested in hearing about new opportunities, collaborations, 
              or just chatting about technology and software development.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#30363d]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
            <span className="text-sm text-[#3fb950]">{availability.status}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#8b949e]">
            <MapPin className="size-4" />
            <span>{availability.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#8b949e]">
            <Calendar className="size-4" />
            <span>{availability.timezone}</span>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contactMethods.map((method) => {
          const Icon = getIcon(method.icon);
          return (
            <a
              key={method.label}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-[#0d1117] border rounded-lg p-4 hover:border-[#58a6ff] transition-colors group ${
                method.primary ? 'border-[#58a6ff]' : 'border-[#30363d]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`size-5 ${
                  method.primary ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#58a6ff]'
                }`} />
                <ExternalLink className="size-3 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs text-[#8b949e] mb-1">{method.label}</div>
              <div className={`text-sm font-mono truncate ${
                method.primary ? 'text-[#58a6ff]' : 'text-[#c9d1d9] group-hover:text-[#58a6ff]'
              }`}>
                {method.value}
              </div>
            </a>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 md:p-6">
        <div className="text-center">
          <h3 className="text-white mb-2">{cta.title}</h3>
          <p className="text-sm text-[#8b949e] mb-4">{cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {emailMethod && (
              <a
                href={emailMethod.link}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors flex items-center gap-2"
              >
                <Mail className="size-4" />
                Send Message
              </a>
            )}
            {githubMethod && (
              <a
                href={githubMethod.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0d1117] hover:bg-[#161b22] text-[#c9d1d9] border border-[#30363d] hover:border-[#58a6ff] rounded-md transition-colors flex items-center gap-2"
              >
                <Github className="size-4" />
                View GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
