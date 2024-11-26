import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BettingSiteCard from '../components/rankItem';
import { 
  Shield, 
  Info, 
  AlertCircle, 
  Gift, 
  Percent, 
  Wallet,
  Star,
  Clock,
  Smartphone,
  LucideIcon 
} from 'lucide-react';

interface BettingSite {
  _id: string;
  siteName: string;
  logo: string;
  advantages: string[];
  welcomeBonus: string;
  payments: string[];
  promoCode: string;
  rank: number;
  createAccountUrl?: string;
  downloadAppUrl?: string;
}

/**
 * Fades in the children when they come into view.
 *
 * Useful for applying an animation to elements that are not initially in the viewport.
 *
 * @example
 * <FadeInWhenVisible>
 *   <p>This text will fade in when it comes into view.</p>
 * </FadeInWhenVisible>
 */


const FadeInWhenVisible: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

/**
 * Page d'accueil de l'application.
 *
 * Cette page affiche la liste des sites de paris, ainsi que des informations supplémentaires.
 *
 * Elle utilise les hooks `useState` et `useEffect` pour gérer l'état de la page et
 * charger les données des sites de paris.
 *
 * Elle rend un composant `Header` qui affiche le logo et le titre de l'application,
 * ainsi que les boutons de navigation.
 *
 * Elle rend également un composant `main` qui contient les éléments suivants:
 * - Un composant `Loader` qui affiche un indicateur de chargement lorsqu'il est en train de charger les données.
 * - Un composant `ErrorMessage` qui affiche un message d'erreur si une erreur se produit lors de la chargement des données.
 * - Un composant `NoResults` qui affiche un message indiquant qu'il n'y a pas de résultats si la liste des sites de paris est vide.
 * - Un composant `BettingSitesList` qui affiche la liste des sites de paris si elle n'est pas vide.
 * - Un composant `PronosticsSection` qui affiche une section avec un bouton pour accéder aux pronostics.
 * - Un composant `StatisticsSection` qui affiche des informations statistiques sur l'application.
 * - Un composant `PromotionSection` qui affiche une section avec des éléments de promotion.
 */
const HomePage: React.FC = () => {
  const [bettingSites, setBettingSites] = useState<BettingSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBettingSites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/rankitems');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a: BettingSite, b: BettingSite) => a.rank - b.rank);
        setBettingSites(sortedData);
      } catch (err) {
        console.error('Failed to fetch betting sites:', err);
        setError('Impossible de charger les sites de paris. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBettingSites();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <main className="space-y-16">
          {isLoading && <Loader />}
          {error && <ErrorMessage error={error} />}
          {!isLoading && !error && bettingSites.length === 0 && <NoResults />}
          {!isLoading && !error && bettingSites.length > 0 && (
            <BettingSitesList sites={bettingSites} />
          )}
          <SelectionCriteriaSection  />
          <BonusAdvantagesSection />
          <ResponsibleGamblingSection />
        </main>
      </div>
    </div>
  );
};

/**
 * The header component of the homepage.
 *
 * It's a motion.div that fades in and moves up from -50px to 0px over 0.5 seconds.
 *
 * It contains a HeaderBackground and a HeaderContent.
 *
 * @returns The header component.
 */
const Header = () => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative h-[60vh] rounded-2xl overflow-hidden mb-16"
  >
    <HeaderBackground />
    <HeaderContent />
  </motion.div>
);

/**
 * The background component of the header.
 *
 * It's an absolute positioned div with a gradient background from black with 80% opacity to black with 40% opacity.
 *
 * It's used to darken the background of the header.
 *
 * @returns The background component.
 */
const HeaderBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 z-10" />
);

/**
 * The content component of the header.
 *
 * It's an absolute positioned div that contains the main heading and paragraph of the header.
 *
 * The heading and paragraph are both motion elements that fade in and move up from 50px to 0px with a delay of 0.2 and 0.4 seconds respectively.
 *
 * @returns The content component.
 */
const HeaderContent = () => (
  <div className="absolute inset-0 flex items-center justify-center z-20">
    <div className="text-center px-4 max-w-4xl">
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-7xl font-black mb-6 text-white"
      >
        Top 10 des Meilleurs Sites de Paris Sportifs
      </motion.h1>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-3xl font-bold text-yellow-300"
      >
        Découvrez les meilleures plateformes en Afrique
      </motion.p>
    </div>
  </div>
);

/**
 * A component that displays a list of betting sites.
 *
 * It takes an array of `BettingSite` objects as a prop, and renders a grid of
 * `BettingSiteCardContainer` components, each of which displays a single betting site.
 *
 * The grid is responsive, with one column on small screens, two columns on medium
 * screens, and three columns on large screens.
 *
 * Each `BettingSiteCardContainer` is wrapped in a `FadeInWhenVisible` component, which
 * fades in the card when it comes into view.
 *
 * @param {{ sites: BettingSite[] }} props
 * @returns {JSX.Element}
 */
const BettingSitesList = ({ sites }: { sites: BettingSite[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {sites.map((site) => (
      <FadeInWhenVisible key={site._id}>
        <BettingSiteCardContainer site={site} />
      </FadeInWhenVisible>
    ))}
  </div>
);

/**
 * A component that displays a single betting site in a card.
 *
 * It takes a `BettingSite` object as a prop, and renders a `BettingSiteCard` component with the site's information.
 *
 * The card is wrapped in a div with a relative position, and contains an absolute positioned div with the rank of the site.
 * The rank is displayed in a yellow gradient background with a rounded corner, and is positioned at the top left of the card.
 *
 * When the card is hovered, it scales up by 5% with a transition effect.
 *
 * @param {{ site: BettingSite }} props
 * @returns {JSX.Element}
 */
const BettingSiteCardContainer = ({ site }: { site: BettingSite }) => (
  <div className="relative transform hover:scale-105 transition-transform duration-300">
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 text-purple-900 rounded-xl flex items-center justify-center font-black text-xl z-10 shadow-lg">
      #{site.rank}
    </div>
    <BettingSiteCard {...site} />
  </div>
);


/**
 * A component that displays a loading animation.
 *
 * It renders a rounded square with a yellow bottom border that spins around its center.
 *
 * The animation is infinite and does not stop until the component is unmounted.
 *
 * This component is used to display a loading state while data is being fetched or processed.
 *
 * @returns {JSX.Element}
 */
const Loader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
  </div>
);

/**
 * Displays an error message in a styled div.
 * 
 * @param error - The error message to display.
 */
const ErrorMessage = ({ error }: { error: string }) => (
  <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-center text-white">
    {error}
  </div>
);

/**
 * A component that displays a message when no results are available.
 *
 * It renders a centered, gray, padded div with a message that says "Aucun site de paris disponible pour le moment".
 *
 * This component is used to display a message when the server returns no results for a given query.
 *
 * @returns {JSX.Element}
 */
const NoResults = () => (
  <div className="text-center text-gray-300 py-12">
    Aucun site de paris disponible pour le moment.
  </div>
);

/**
 * A section that displays the selection criteria for the top 10 betting sites.
 *
 * This component explains how sites are evaluated and selected for the ranking,
 * building trust with users by showing the thorough evaluation process.
 */
const SelectionCriteriaSection = () => (
  <FadeInWhenVisible>
    <div className="bg-gradient-to-r from-purple-700/50 to-purple-600/50 rounded-2xl p-10 backdrop-blur-sm">
      <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
        Nos Critères de Sélection
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CriteriaCard
          icon={Star}
          title="Fiabilité Testée"
          description="Tous les sites sont testés en conditions réelles : dépôts, retraits, service client"
          highlight="100% Testé"
        />
        <CriteriaCard
          icon={Clock}
          title="Rapidité des Paiements"
          description="Nous vérifions les délais de retrait pour garantir des paiements rapides"
          highlight="24-72h max"
        />
        <CriteriaCard
          icon={Smartphone}
          title="Interface & Mobile"
          description="Applications mobiles performantes et interfaces intuitives pour parier facilement"
          highlight="UX Optimisée"
        />
      </div>
    </div>
  </FadeInWhenVisible>
);

const CriteriaCard = ({ 
  icon: Icon, 
  title, 
  description,
  highlight 
}: { 
  icon: LucideIcon;
  title: string;
  description: string;
  highlight: string;
}) => (
  <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-6 rounded-xl backdrop-blur-sm border border-purple-700/30 relative overflow-hidden group hover:scale-105 transition-all duration-300">
    <div className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
      {highlight}
    </div>
    <Icon className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
    <h3 className="text-xl font-bold text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-300">
      {description}
    </p>
  </div>
);

/**
 * A section that displays a selection of exclusive bonuses available to users.
 * 
 * The section is a container with a gradient background, and contains a title, and a grid of 3 cards.
 * Each card displays an icon, a title, a description, and a highlight (a key metric or benefit).
 * The icons are: Gift (bonus de bienvenue), Percent (codes promotionnels), and Wallet (bonus sans dépôt).
 * The highlights are: "Jusqu'à 130%", "100% Vérifiés", and "Offres Spéciales".
 * The section is wrapped in a FadeInWhenVisible component, which makes it fade in when the user scrolls to it.
 */
const BonusAdvantagesSection = () => (
  <FadeInWhenVisible>
    <div className="bg-gradient-to-r from-purple-700/50 to-purple-600/50 rounded-2xl p-10 backdrop-blur-sm">
      <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
        Avantages Exclusifs
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BonusCard
          icon={Gift}
          title="Bonus de Bienvenue"
          description="Profitez de bonus exclusifs jusqu'à 130% sur votre premier dépôt"
          highlight="Jusqu'à 130%"
        />
        <BonusCard
          icon={Percent}
          title="Codes Promotionnels"
          description="Accédez à des codes promo VIP valables sur tous les paris sportifs"
          highlight="100% Vérifiés"
        />
         <BonusCard
          icon={Wallet}
          title="Bonus Sans Dépôt"
          description="Certains sites offrent des bonus sans dépôt pour commencer à parier"
          highlight="Offres Spéciales"
        />
      </div>
    </div>
  </FadeInWhenVisible>
);

const BonusCard = ({ 
  icon: Icon, 
  title, 
  description,
  highlight 
}: { 
  icon: LucideIcon;
  title: string;
  description: string;
  highlight: string;
}) => (
  <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-6 rounded-xl backdrop-blur-sm border border-purple-700/30 relative overflow-hidden">
    <div className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
      {highlight}
    </div>
    <Icon className="w-12 h-12 text-yellow-400 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-300">
      {description}
    </p>
  </div>
);

/**
 * A section that promotes responsible sports betting.
 *
 * This component highlights the importance of betting responsibly
 * by displaying information cards on legal sites, verified promo codes,
 * and responsible betting practices.
 *
 * It uses a visually appealing gradient background and is wrapped
 * in a `FadeInWhenVisible` component for a smooth fade-in effect
 * when it comes into view.
 */
const ResponsibleGamblingSection = () => (
  <FadeInWhenVisible>
    <div className="bg-gradient-to-r from-purple-700/50 to-purple-600/50 rounded-2xl p-10 backdrop-blur-sm">
      <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
        Paris Sportifs Responsables
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoCard
          icon={Shield}
          title="Sites Légaux"
          description="Tous nos partenaires sont agréés et régulés par les autorités compétentes"
        />
        <InfoCard
          icon={Info}
          title="Codes Promo Vérifiés"
          description="Codes promotionnels testés et mis à jour quotidiennement"
        />
        <InfoCard
          icon={AlertCircle}
          title="Pariez Responsable"
          description="Fixez-vous des limites et ne pariez que ce que vous pouvez vous permettre de perdre"
        />
      </div>
    </div>
  </FadeInWhenVisible>
);

const InfoCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
}) => (
  <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-6 rounded-xl backdrop-blur-sm border border-purple-700/30">
    <Icon className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
    <h3 className="text-xl font-bold text-white mb-2 text-center">
      {title}
    </h3>
    <p className="text-gray-300 text-center">
      {description}
    </p>
  </div>
);
export default HomePage;