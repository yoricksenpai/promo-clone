import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BettingSiteCard from '../components/rankItem';
import { ArrowRight, Trophy, Users, Calendar, LucideIcon } from 'lucide-react';

interface BettingSite {
  _id: string;
  siteName: string;
  logo: string;
  advantages: string[];
  welcomeBonus: string;
  payments: string[];
  promoCode: string;
  rank: number;
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


const FadeInWhenVisible: React.FC = ({ children }) => (
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
  /**
   * Charge les sites de paris depuis l'API.
   *
   * Met à jour l'état de la page en fonction du résultat de la requête.
   * Si la requête réussit, met à jour l'état `bettingSites` avec les données
   * reçues, triées par rang.
   * Si la requête échoue, met à jour l'état `error` avec un message d'erreur.
   * Finalement, met à jour l'état `isLoading` pour indiquer que le chargement
   * est terminé.
   */
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
          <PronosticsSection />
          <StatisticsSection />
          <PromotionSection />
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
 * A section that displays free betting predictions.
 *
 * This component uses a gradient background and a flex layout to present
 * information attractively. It includes a heading, a description, and a 
 * call-to-action button that invites users to view daily predictions.
 *
 * The section is wrapped in a `FadeInWhenVisible` component to apply a fade-in
 * animation when it comes into view.
 */
const PronosticsSection = () => (
  <FadeInWhenVisible>
    <div className="bg-gradient-to-r from-purple-700/50 to-purple-600/50 rounded-2xl p-10 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Pronostics Gratuits
          </h2>
          <p className="text-xl text-gray-200">
            Notre équipe d'experts vous offre des pronostics gratuits quotidiens pour vous aider dans vos paris.
          </p>
        </div>
        <CallToActionButton
          label="Voir les pronostics du jour"
          icon={ArrowRight}
          gradient="from-green-500 to-green-600"
        />
      </div>
    </div>
  </FadeInWhenVisible>
);

/**
 * A section that displays some statistics about the application.
 *
 * The section includes a heading and a three-column grid of `StatCard` components.
 * Each `StatCard` displays a value and a label. The values are 15, 230k, and 340+,
 * and the labels are "Années d'expérience", "Utilisateurs actifs", and "Pronostics par mois"
 * respectively.
 *
 * The section is wrapped in a `FadeInWhenVisible` component to apply a fade-in
 * animation when it comes into view.
 */
const StatisticsSection = () => (
  <FadeInWhenVisible>
    <div className="bg-gradient-to-r from-purple-700/50 to-purple-600/50 rounded-2xl p-10 backdrop-blur-sm">
      <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
        Ce qu'ils en disent
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard icon={Trophy} value="15" label="Années d'expérience" />
        <StatCard icon={Users} value="230k" label="Utilisateurs actifs" />
        <StatCard icon={Calendar} value="340+" label="Pronostics par mois" />
      </div>
    </div>
  </FadeInWhenVisible>
);

/**
 * A section that highlights promotional content.
 *
 * This section includes an eye-catching heading and a brief description
 * encouraging users to explore strategies for maximizing their gains.
 * It features a call-to-action button for further engagement.
 *
 * The section is styled with a gradient background and a fade-in animation
 * when it becomes visible in the viewport.
 */
const PromotionSection = () => (
  <FadeInWhenVisible>
    <div className="bg-gradient-to-r from-purple-700/50 to-purple-600/50 rounded-2xl p-10 text-center backdrop-blur-sm">
      <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
        Gagner 7825€ chaque semaine ?
      </h2>
      <p className="text-xl text-gray-200 mb-8">
        Découvrez notre stratégie pour maximiser vos gains.
      </p>
      <CallToActionButton
        label="En savoir plus"
        icon={ArrowRight}
        gradient="from-purple-500 to-purple-600"
      />
    </div>
  </FadeInWhenVisible>
);

/**
 * A button component with a gradient background and an icon.
 * 
 * This component displays a button with a specified label, icon, and gradient background.
 * The button has a hover effect that adds a shadow and translates the icon slightly.
 *
 * @param {string} label - The text label displayed on the button.
 * @param {LucideIcon} icon - The icon component to display alongside the label.
 * @param {string} gradient - The gradient classes to apply for the button's background.
 */
const CallToActionButton = ({
  label,
  icon: Icon,
  gradient,
}: {
  label: string;
  icon: LucideIcon;
  gradient: string;
}) => (
  <button className={`group flex items-center gap-2 bg-gradient-to-r ${gradient} text-white font-bold py-4 px-8 rounded-xl mx-auto transition-all duration-300 hover:shadow-lg hover:shadow-${gradient.split(' ')[1]}/25`}>
    {label}
    <Icon className="group-hover:translate-x-1 transition-transform" />
  </button>
);

/**
 * A card component that displays a statistic with an icon, value, and label.
 *
 * This component uses a gradient background and a backdrop blur effect to 
 * visually highlight the statistic. It centers the icon and value, and 
 * provides a label underneath.
 *
 * @param {LucideIcon} icon - The icon component to display at the top of the card.
 * @param {string} value - The numeric or textual value representing the statistic.
 * @param {string} label - A description or label for the statistic.
 */
const StatCard = ({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) => (
  <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-8 rounded-xl backdrop-blur-sm border border-purple-700/30">
    <Icon className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
    <p className="font-black text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2 text-center">
      {value}
    </p>
    <p className="text-xl text-center text-gray-300">{label}</p>
  </div>
);

export default HomePage;