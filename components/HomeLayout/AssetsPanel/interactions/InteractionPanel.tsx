"use client";
import React from "react";
import {
  Link2,
  Link,
  CircleDot,
  PlusCircle,
  MonitorPlay,
  GalleryHorizontal,
  PictureInPicture2,
  MessageSquareText,
  Video,
  Volume2,
  ShoppingCart,
  ShoppingBag,
  Tag,
  ListX,
  HelpCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
} from "lucide-react";
import {
  FaTiktok,
  FaPinterest,
  FaRedditAlien,
  FaSpotify,
  FaYoutube,
  FaInstagram,
  FaFacebookMessenger,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaWhatsapp,
  FaSnapchat,
} from "react-icons/fa6";

const InteractionPanel: React.FC = () => {
  // const addElement = useEditorStore((s) => s.addElement);
  // const { slides, activeSlide } = useEditorStore();
  // const canvasWidth = slides[activeSlide]?.width;
  // const canvasHeight = slides[activeSlide]?.height;
  // const defaultX = canvasWidth ? canvasWidth / 2 - 70 : 100;
  // const defaultY = canvasHeight ? canvasHeight / 2 - 60 : 100;

  const linksAndTags: InteractionItem[] = [
    { label: "Link area", icon: Link2, dashed: true },
    { label: "Link button", icon: Link },
    { label: "Tag", icon: CircleDot },
    { label: "Caption", icon: PlusCircle },
  ];

  const engagement: InteractionItem[] = [
    { label: "Quiz", icon: ListX, dashed: true },
    { label: "Question", icon: HelpCircle, dashed: true },
    { label: "Contact form", icon: Mail },
  ];

  const navigation: InteractionItem[] = [
    { label: "Prev page", icon: ChevronLeft },
    { label: "Next page", icon: ChevronRight },
    { label: "Go to page", icon: ArrowUpRight },
    { label: "First page", icon: ChevronsLeft },
    { label: "Last page", icon: ChevronsRight },
  ];

  const social: SocialItem[] = [
    { label: "TikTok", icon: FaTiktok },
    { label: "Pinterest", icon: FaPinterest },
    { label: "Reddit", icon: FaRedditAlien },
    { label: "Spotify", icon: FaSpotify },
    { label: "YouTube", icon: FaYoutube },
    { label: "Instagram", icon: FaInstagram },
    { label: "Messenger", icon: FaFacebookMessenger },
    { label: "Facebook", icon: FaFacebookF },
    { label: "LinkedIn", icon: FaLinkedinIn },
    { label: "X", icon: FaXTwitter },
    { label: "Snapchat", icon: FaSnapchat },
    { label: "WhatsApp", icon: FaWhatsapp },
  ];

  const multimedia: InteractionItem[] = [
    { label: "Spotlight", icon: MonitorPlay, pro: true },
    { label: "Slideshow", icon: GalleryHorizontal, pro: true },
    { label: "Pop-up slideshow", icon: PictureInPicture2, pro: true, dashed: true },
    { label: "Video embed", icon: MessageSquareText, pro: true },
    { label: "Video button", icon: Video, pro: true },
    { label: "Audio button", icon: Volume2, pro: true },
  ];

  const shop: InteractionItem[] = [
    { label: "Product card", icon: ShoppingCart, pro: true, dashed: true },
    { label: "Product button", icon: ShoppingBag, pro: true },
    { label: "Price tag", icon: Tag, pro: true },
  ];

  const otherSquare: InteractionItem[] = [
    { label: "Cart icon", icon: ShoppingCart },
    { label: "Card icon", icon: CreditCard },
  ];

  const otherWide: WideInteractionItem[] = [
    { label: "Buy this item", icon: ShoppingCart },
    { label: "Buy this item", icon: CreditCard },
  ];

  return (
    <div className="kd-text-add-panel-container bg-white">
      <div className="kd-text-add-panel-fixed">
        <div className="flex items-center justify-between mb-3">
          <span className="kd-toolPanel-heding-text text-gray-900">
            Interactions
          </span>
        </div>
        <div className="w-full kd-toolPanel-hr-devide-border mb-2 border-gray-200" />
      </div>

      <div className="kd-text-add-panel-scroll space-y-5 px-3 pb-4">
        <InteractionSection title="Links and tags" items={linksAndTags} />

        <InteractionSection
          title="Engagement"
          items={engagement}
          badgeLabel="Business"
        />

        <InteractionSection title="Navigation" items={navigation} />

        <SocialSection title="Social" items={social} />

        <InteractionSection
          title="Multimedia"
          items={multimedia}
          badgeLabel="Professional"
        />

        <InteractionSection
          title="Shop"
          items={shop}
          badgeLabel="Professional"
        />

        <div className="space-y-2">
          <div className="px-1">
            <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
              Other
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {otherSquare.map((item) => (
              <InteractionCard key={item.label} {...item} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {otherWide.map((item, i) => (
              <WideInteractionCard key={`${item.label}-${i}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InteractionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pro?: boolean;
  dashed?: boolean;
}

interface SocialItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface WideInteractionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface InteractionSectionProps {
  title: string;
  items: InteractionItem[];
  badgeLabel?: string;
}

;

const InteractionSection: React.FC<InteractionSectionProps> = ({
  title,
  items,
  badgeLabel,
}) => {
  return (
    <div className="space-y-2">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <InteractionCard key={item.label} {...item} pro={!!badgeLabel || item.pro} />
        ))}
      </div>
    </div>
  );
};

const InteractionCard: React.FC<InteractionItem> = ({
  label,
  icon: Icon,
  dashed,
}) => {
  return (
    <button
      type="button"
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors px-2 py-4 ${
        dashed ? "border-dashed border-gray-300" : "border-gray-200"
      }`}
    >
     
      <Icon className="w-5 h-5 text-gray-700" />
      <span className="text-[11px] text-gray-700 leading-tight text-center">
        {label}
      </span>
    </button>
  );
};

const WideInteractionCard: React.FC<WideInteractionItem> = ({
  label,
  icon: Icon,
}) => {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors px-4 py-3"
    >
      <Icon className="w-5 h-5 text-gray-700 shrink-0" />
      <span className="text-[12px] font-medium text-gray-700">{label}</span>
    </button>
  );
};

interface SocialSectionProps {
  title: string;
  items: SocialItem[];
}

const SocialSection: React.FC<SocialSectionProps> = ({ title, items }) => {
  return (
    <div className="space-y-2">
      <div className="px-1">
        <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <SocialCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};

const SocialCard: React.FC<SocialItem> = ({ label, icon: Icon }) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors aspect-square"
    >
      <Icon className="w-5 h-5 text-gray-700" />
    </button>
  );
};

export default InteractionPanel;