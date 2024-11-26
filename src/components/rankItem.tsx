import React from 'react';
import { ArrowRight, Gift, Wallet, Download, UserPlus, LucideIcon } from 'lucide-react';

interface BettingSiteCardProps {
  siteName: string;
  logo: string;
  advantages: string[];
  welcomeBonus: string;
  payments: string[];
  promoCode: string;
  createAccountUrl: string;
  downloadAppUrl: string;
}

/**
 * A component that displays a detailed card for a betting site.
 *
 * It showcases the site's name, logo, advantages, welcome bonus,
 * available payment methods, and a promotional code.
 * The card features a visually appealing gradient background and
 * hover effects that enhance its appearance.
 *
 * Props:
 * - `siteName`: The name of the betting site.
 * - `logo`: URL of the site's logo image.
 * - `advantages`: List of advantages offered by the site.
 * - `welcomeBonus`: The welcome bonus provided by the site.
 * - `payments`: List of accepted payment methods.
 * - `promoCode`: Promotional code for exclusive offers.
 *
 * The card includes interactive buttons for creating an account
 * and downloading additional information.
 */
const BettingSiteCard: React.FC<BettingSiteCardProps> = ({
  siteName,
  logo,
  advantages,
  welcomeBonus,
  payments,
  promoCode,
  createAccountUrl,
  downloadAppUrl

}) => {
  return (
    <div className="group relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
      
      <div className="relative aspect-video">
        <img
          alt={siteName}
          src={logo}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="relative p-6 space-y-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          {siteName}
        </h3>

        <div className="space-y-4 transition-all duration-300 transform">
          <FeatureSection icon={Gift} title="Avantages">
            {advantages.map((advantage, index) => (
              <span key={index} className="inline-block bg-white/10 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                {advantage}
              </span>
            ))}
          </FeatureSection>

          <FeatureSection icon={Gift} title="Bonus de Bienvenue">
            <span className="text-green-400 font-semibold">{welcomeBonus}</span>
          </FeatureSection>

          <FeatureSection icon={Wallet} title="Méthodes de Paiement">
            <div className="flex flex-wrap gap-2">
              {payments.map((payment, index) => (
                <span key={index} className="bg-white/10 rounded-full px-3 py-1 text-sm">
                  {payment}
                </span>
              ))}
            </div>
          </FeatureSection>

          <div className="bg-yellow-400/20 rounded-xl p-4">
            <p className="text-yellow-400 font-bold flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Code Promo 2024: <span className="text-white">{promoCode}</span>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => window.open(createAccountUrl, '_blank')} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 group/btn">
              <UserPlus className="w-5 h-5" />
              Créer un compte
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
            { downloadAppUrl && 
            <button onClick={() => window.open(downloadAppUrl, '_blank')} className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Télécharger
          </button>
            }

          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * A component that renders a section with an icon, title, and children.
 *
 * The icon is rendered as a LucideIcon component, and the title is rendered as an h4 element.
 * The children are rendered as a div element with a CSS class of "text-white".
 * The component renders a gap of 2 between the icon and the title, and a gap of 2 between the title and the children.
 *
 * @param {LucideIcon} icon - The icon to render.
 * @param {string} title - The title of the section.
 * @param {React.ReactNode} children - The children to render.
 * @returns {JSX.Element} A JSX element representing the section.
 */
const FeatureSection = ({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: LucideIcon; 
  title: string; 
  children: React.ReactNode; 
}) => (
  <div className="space-y-2">
    <h4 className="text-gray-300 font-medium flex items-center gap-2">
      <Icon className="w-4 h-4 text-yellow-400" />
      {title}
    </h4>
    <div className="text-white">{children}</div>
  </div>
);

export default BettingSiteCard;