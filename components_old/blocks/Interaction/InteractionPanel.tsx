// "use client";
// import React from "react";
// import {
//   Link2,
//   Link,
//   CircleDot,
//   PlusCircle,
//   MonitorPlay,
//   GalleryHorizontal,
//   PictureInPicture2,
//   MessageSquareText,
//   Video,
//   Volume2,
//   ShoppingCart,
//   ShoppingBag,
//   Tag,
//   ListX,
//   HelpCircle,
//   Mail,
//   ChevronLeft,
//   ChevronRight,
//   ArrowUpRight,
//   ChevronsLeft,
//   ChevronsRight,
//   CreditCard,
// } from "lucide-react";
// import {
//   FaTiktok,
//   FaPinterest,
//   FaRedditAlien,
//   FaSpotify,
//   FaYoutube,
//   FaInstagram,
//   FaFacebookMessenger,
//   FaFacebookF,
//   FaLinkedinIn,
//   FaXTwitter,
//   FaWhatsapp,
//   FaSnapchat,
// } from "react-icons/fa6";

// const InteractionPanel: React.FC = () => {
//   const linksAndTags: InteractionItem[] = [
//     { label: "Link area", icon: Link2, dashed: true },
//     { label: "Link button", icon: Link },
//     { label: "Tag", icon: CircleDot },
//     { label: "Caption", icon: PlusCircle },
//   ];

//   const engagement: InteractionItem[] = [
//     { label: "Quiz", icon: ListX, dashed: true },
//     { label: "Question", icon: HelpCircle, dashed: true },
//     { label: "Contact form", icon: Mail },
//   ];

//   const navigation: InteractionItem[] = [
//     { label: "Prev page", icon: ChevronLeft },
//     { label: "Next page", icon: ChevronRight },
//     { label: "Go to page", icon: ArrowUpRight },
//     { label: "First page", icon: ChevronsLeft },
//     { label: "Last page", icon: ChevronsRight },
//   ];

//   const social: SocialItem[] = [
//     { label: "TikTok", icon: FaTiktok },
//     { label: "Pinterest", icon: FaPinterest },
//     { label: "Reddit", icon: FaRedditAlien },
//     { label: "Spotify", icon: FaSpotify },
//     { label: "YouTube", icon: FaYoutube },
//     { label: "Instagram", icon: FaInstagram },
//     { label: "Messenger", icon: FaFacebookMessenger },
//     { label: "Facebook", icon: FaFacebookF },
//     { label: "LinkedIn", icon: FaLinkedinIn },
//     { label: "X", icon: FaXTwitter },
//     { label: "Snapchat", icon: FaSnapchat },
//     { label: "WhatsApp", icon: FaWhatsapp },
//   ];

//   const multimedia: InteractionItem[] = [
//     { label: "Spotlight", icon: MonitorPlay, pro: true },
//     { label: "Slideshow", icon: GalleryHorizontal, pro: true },
//     {
//       label: "Pop-up slideshow",
//       icon: PictureInPicture2,
//       pro: true,
//       dashed: true,
//     },
//     { label: "Video embed", icon: MessageSquareText, pro: true },
//     { label: "Video button", icon: Video, pro: true },
//     { label: "Audio button", icon: Volume2, pro: true },
//   ];

//   const shop: InteractionItem[] = [
//     { label: "Product card", icon: ShoppingCart, pro: true, dashed: true },
//     { label: "Product button", icon: ShoppingBag, pro: true },
//     { label: "Price tag", icon: Tag, pro: true },
//   ];

//   const otherSquare: InteractionItem[] = [
//     { label: "Cart icon", icon: ShoppingCart },
//     { label: "Card icon", icon: CreditCard },
//   ];

//   const otherWide: WideInteractionItem[] = [
//     { label: "Buy this item", icon: ShoppingCart },
//     { label: "Buy this item", icon: CreditCard },
//   ];

//   return (
//     <div className="kd-text-add-panel-container bg-white">
//       <div className="kd-text-add-panel-fixed">
//         <div className="flex items-center justify-between mb-3">
//           <span className="kd-toolPanel-heding-text text-gray-900">
//             Interactions
//           </span>
//         </div>
//         <div className="w-full kd-toolPanel-hr-devide-border mb-2 border-gray-200" />
//       </div>

//       <div className="kd-text-add-panel-scroll space-y-5 px-3 pb-4">
//         <InteractionSection title="Links and tags" items={linksAndTags} />

//         <InteractionSection
//           title="Engagement"
//           items={engagement}
//           badgeLabel="Business"
//         />

//         <InteractionSection title="Navigation" items={navigation} />

//         <SocialSection title="Social" items={social} />

//         <InteractionSection
//           title="Multimedia"
//           items={multimedia}
//           badgeLabel="Professional"
//         />

//         <InteractionSection
//           title="Shop"
//           items={shop}
//           badgeLabel="Professional"
//         />

//         <div className="space-y-2">
//           <div className="px-1">
//             <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
//               Other
//             </h3>
//           </div>
//           <div className="grid grid-cols-3 gap-2">
//             {otherSquare.map((item) => (
//               <InteractionCard key={item.label} {...item} />
//             ))}
//           </div>
//           <div className="grid grid-cols-1 gap-2">
//             {otherWide.map((item, i) => (
//               <WideInteractionCard key={`${item.label}-${i}`} {...item} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface InteractionItem {
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
//   pro?: boolean;
//   dashed?: boolean;
// }

// interface SocialItem {
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// interface WideInteractionItem {
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// interface InteractionSectionProps {
//   title: string;
//   items: InteractionItem[];
//   badgeLabel?: string;
// }

// const InteractionSection: React.FC<InteractionSectionProps> = ({
//   title,
//   items,
//   badgeLabel,
// }) => {
//   return (
//     <div className="space-y-2">
//       <div className="px-1 flex items-center justify-between">
//         <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
//           {title}
//         </h3>
//       </div>
//       <div className="grid grid-cols-3 gap-2">
//         {items.map((item) => (
//           <InteractionCard
//             key={item.label}
//             {...item}
//             pro={!!badgeLabel || item.pro}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const InteractionCard: React.FC<InteractionItem> = ({
//   label,
//   icon: Icon,
//   dashed,
// }) => {
//   return (
//     <button
//       type="button"
//       className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors px-2 py-4 ${
//         dashed ? "border-dashed border-gray-300" : "border-gray-200"
//       }`}
//     >
//       <Icon className="w-5 h-5 text-gray-700" />
//       <span className="text-[11px] text-gray-700 leading-tight text-center">
//         {label}
//       </span>
//     </button>
//   );
// };

// const WideInteractionCard: React.FC<WideInteractionItem> = ({
//   label,
//   icon: Icon,
// }) => {
//   return (
//     <button
//       type="button"
//       className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors px-4 py-3"
//     >
//       <Icon className="w-5 h-5 text-gray-700 shrink-0" />
//       <span className="text-[12px] font-medium text-gray-700">{label}</span>
//     </button>
//   );
// };

// interface SocialSectionProps {
//   title: string;
//   items: SocialItem[];
// }

// const SocialSection: React.FC<SocialSectionProps> = ({ title, items }) => {
//   return (
//     <div className="space-y-2">
//       <div className="px-1">
//         <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
//           {title}
//         </h3>
//       </div>
//       <div className="grid grid-cols-4 gap-2">
//         {items.map((item) => (
//           <SocialCard key={item.label} {...item} />
//         ))}
//       </div>
//     </div>
//   );
// };

// const SocialCard: React.FC<SocialItem> = ({ label, icon: Icon }) => {
//   return (
//     <button
//       type="button"
//       title={label}
//       aria-label={label}
//       className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors aspect-square"
//     >
//       <Icon className="w-5 h-5 text-gray-700" />
//     </button>
//   );
// };

// export default InteractionPanel;

"use client";
import React from "react";
import useEditorStore, {
  InteractionData,
  InteractionKind,
} from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
// import { interactionIconSvg } from "@/assets/icons/interactions/interactionIconSvg";
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

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const interactionIconSvg = {
  "link-area": svg(
    '<path d="M10.5 13.5a4.25 4.25 0 0 0 6.01.01l2-2a4.25 4.25 0 0 0-6.01-6.01l-1.15 1.14"/><path d="M13.5 10.5a4.25 4.25 0 0 0-6.01-.01l-2 2a4.25 4.25 0 0 0 6.01 6.01l1.14-1.14"/><rect x="3" y="3" width="18" height="18" rx="3" stroke-dasharray="2.5 2.5"/>',
  ),
  "link-button": svg(
    '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10 14l4-4M10.5 10H14v3.5"/>',
  ),
  tag: svg(
    '<path d="M20 13.5 13.5 20a2 2 0 0 1-2.83 0L4 13.33V4h9.33L20 10.67a2 2 0 0 1 0 2.83Z"/><circle cx="8.5" cy="8.5" r="1"/>',
  ),
  caption: svg(
    '<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M8 10h8M8 13h5"/>',
  ),
  TikTok: svg(
    '<path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 4c.6 2.45 2.1 3.95 4.5 4.5"/>',
  ),
  Pinterest: svg(
    '<path d="M12 21c1.1-2.4 1.8-4.23 2.05-5.48"/><path d="M9.3 14.3c-1.2-.7-2-2.1-2-3.8 0-2.8 2.1-5 5-5 3.15 0 4.8 2.25 4.8 4.6 0 3.2-1.4 5.6-3.5 5.6-1.15 0-2-1-1.7-2.2l.65-2.75c.38-1.6-.2-2.8-1.36-2.8-1.08 0-1.9 1.1-1.9 2.58 0 .93.32 1.56.32 1.56l-1.3 5.5"/>',
  ),
  Reddit: svg(
    '<circle cx="12" cy="12.5" r="7"/><path d="M12 5.5 13 3l2.5.65M8.5 12h.01M15.5 12h.01M8.5 15c1.8 1.3 5.2 1.3 7 0M5.2 10.2 3.5 9M18.8 10.2 20.5 9"/>',
  ),
  Spotify: svg(
    '<circle cx="12" cy="12" r="8.5"/><path d="M7.8 10.1c3.1-.9 6.5-.55 8.7.7M8.4 13c2.55-.7 5.3-.42 7.25.62M9 15.65c1.92-.48 3.92-.22 5.5.5"/>',
  ),
  YouTube: svg(
    '<path d="M20.2 7.1a2.5 2.5 0 0 0-1.76-1.77C16.9 5 12 5 12 5s-4.9 0-6.44.33A2.5 2.5 0 0 0 3.8 7.1C3.47 8.65 3.47 12 3.47 12s0 3.35.33 4.9a2.5 2.5 0 0 0 1.76 1.77C7.1 19 12 19 12 19s4.9 0 6.44-.33a2.5 2.5 0 0 0 1.76-1.77c.33-1.55.33-4.9.33-4.9s0-3.35-.33-4.9Z"/><path d="m10 9 5 3-5 3V9Z"/>',
  ),
  Instagram: svg(
    '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M17.5 6.5h.01"/>',
  ),
  Messenger: svg(
    '<path d="M20 11.5c0 4.14-3.58 7.5-8 7.5-1.1 0-2.15-.2-3.1-.6L4 20l1.45-3.25A7.05 7.05 0 0 1 4 12c0-4.14 3.58-7.5 8-7.5s8 3.36 8 7.5Z"/><path d="m8 13 2.8-3 2.1 2 3.1-3"/>',
  ),
  Facebook: svg(
    '<path d="M14 21v-8h3l.5-3H14V8.25C14 7.38 14.3 7 15.42 7H17.5V4.3A25 25 0 0 0 15.65 4C12.9 4 11 5.68 11 8.75V10H8v3h3v8"/>',
  ),
  LinkedIn: svg(
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 10v6M8 7.5h.01M11.5 16v-3.4a2.1 2.1 0 0 1 4.2 0V16M11.5 10v6"/>',
  ),
  X: svg('<path d="M5 4.5 19 19.5M19 4.5 5 19.5"/>'),
  WhatsApp: svg(
    '<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.2-.45.45-.45.7-.45h.5c.16 0 .35.05.43.3l.65 1.55c.1.25.05.42-.05.58l-.4.48c-.13.13-.25.26-.1.5.15.25.67 1.1 1.44 1.78.99.87 1.82 1.14 2.08 1.27"/>',
  ),
  Snapchat: svg(
    '<path d="M8.4 18c.7.2 1.4.65 2 1.2.55.5 1.05.8 1.6.8s1.05-.3 1.6-.8c.6-.55 1.3-1 2-1.2.75-.22 1.4-.55 1.4-1.15 0-.33-.25-.55-.75-.65-.72-.15-1.24-.55-1.55-1.2-.36-.75-.36-1.6-.36-3.1 0-2.2-.9-3.75-2.34-3.75s-2.34 1.55-2.34 3.75c0 1.5 0 2.35-.36 3.1-.3.65-.83 1.05-1.55 1.2-.5.1-.75.32-.75.65 0 .6.65.93 1.4 1.15Z"/>',
  ),
} as const;

const genId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

const ENGAGEMENT_KIND_MAP: Record<string, InteractionKind> = {
  Quiz: "quiz",
  Question: "question",
  "Contact form": "contact-form",
};

const engagementDefaults: Record<
  "quiz" | "question" | "contact-form",
  Partial<InteractionData> & { width: number; height: number }
> = {
  quiz: {
    width: 150,
    height: 42,
    text: "TAKE QUIZ",
    quizTitle: "Quick quiz",
    quizQuestions: [
      {
        id: genId(),
        question: "What makes KPIs effective?",
        multiple: false,
        options: [
          { id: genId(), text: "Aligning with goals", correct: false },
          { id: genId(), text: "Being vague", correct: false },
          { id: genId(), text: "Being measurable", correct: true },
          { id: genId(), text: "Ignoring progress", correct: false },
        ],
      },
    ],
  },
  question: {
    width: 170,
    height: 42,
    text: "ANSWER QUESTION",
    questionTitle: "Quick question",
    questionText: "What's the overtime policy?",
    questionPlaceholder: "Type your answer here…",
  },
  "contact-form": {
    width: 140,
    height: 42,
    text: "Contact form",
    contactFormTitle: "Tell us about this form",
    contactFormDescription:
      "This form intents to show you how a form will look like, so please fill free to complete every field, or not. No hard feelings.",
    contactFields: [
      { id: genId(), label: "Full company name", type: "text", placeholder: "Full company name", required: true },
      { id: genId(), label: "Email address", type: "email", placeholder: "Email address", required: true },
      { id: genId(), label: "Phone number", type: "tel", placeholder: "Phone number", required: false },
    ],
    privacyPolicyText: "I agree to the following company's Privacy Policy:",
    privacyPolicyLink: "https://demo.com",
    showMarketingOptIn: true,
    marketingOptInText: "I agree to receive marketing materials",
  },
};

const InteractionPanel: React.FC = () => {
  const addElement = useEditorStore((s) => s.addElement);
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);

  const addInteraction = (kind: InteractionKind, platform?: string) => {
    const isEngagement = kind === "quiz" || kind === "question" || kind === "contact-form";
    const engagementDefault = isEngagement
      ? engagementDefaults[kind as "quiz" | "question" | "contact-form"]
      : null;
    const [width, height] = engagementDefault
      ? [engagementDefault.width, engagementDefault.height]
      : (
          {
            "link-area": [42, 42],
            "link-button": [42, 42],
            tag: [42, 42],
            caption: [42, 42],
            social: [42, 42],
          } as Record<Exclude<InteractionKind, "quiz" | "question" | "contact-form">, [number, number]>
        )[kind as Exclude<InteractionKind, "quiz" | "question" | "contact-form">];
    const slide = slides[activeSlide];
    addElement({
      type: "interaction",
      interactionKind: kind,
      svg: platform
        ? interactionIconSvg[platform as keyof typeof interactionIconSvg]
        : isEngagement
          ? ""
          : interactionIconSvg[kind as Exclude<InteractionKind, "social" | "quiz" | "question" | "contact-form">],
      platform,
      text: isEngagement ? "" : "",
      x: (slide?.width ?? 350) / 2 - width / 2,
      y: (slide?.height ?? 490) / 2 - height / 2,
      width,
      height,
      rotation: 0,
      opacity: kind === "link-area" ? 0.12 : 1,
      zIndex: 1,
      fontFamily: "Inter",
      fontSize: isEngagement ? 13 : 14,
      fontWeight: isEngagement ? 700 : 600,
      textColor: "#ffffff",
      backgroundColor: isEngagement
        ? "#18181b"
        : kind === "link-area"
          ? "#6366f1"
          : kind === "tag"
            ? "#7c3aed"
            : "#4f46e5",
      borderRadius: isEngagement ? 6 : kind === "tag" || kind === "social" ? 999 : 8,
      borderWidth: 0,
      iconPosition: "left",
      target: "_blank",
      tooltip: kind === "link-area" ? "Clickable area" : "",
      expandedText: "Add your caption text here.",
      ...(engagementDefault ?? {}),
    } as InteractionData);
    const inserted = useEditorStore
      .getState()
      .slides[activeSlide]?.elements.at(-1);
    if (inserted) useEditorStore.getState().setActiveElementId(inserted.id);
    const ui = useEditorUIStore.getState();
    ui.setActivePanelType("edit");
    ui.setSidebarWidth("edit");
    useEditorStore.getState().setActiveRightPanel("InteractionSettings");
  };

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
    {
      label: "Pop-up slideshow",
      icon: PictureInPicture2,
      pro: true,
      dashed: true,
    },
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

  // const otherWide: WideInteractionItem[] = [
  //   { label: "Buy this item", icon: ShoppingCart },
  //   { label: "Buy this item", icon: CreditCard },
  // ];

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
        <InteractionSection
          title="Links and tags"
          items={linksAndTags}
          onAdd={(label) =>
            addInteraction(
              (
                {
                  "Link area": "link-area",
                  "Link button": "link-button",
                  Tag: "tag",
                  Caption: "caption",
                } as Record<string, InteractionKind>
              )[label],
            )
          }
        />

        <InteractionSection
          title="Engagement"
          items={engagement}
          badgeLabel="Business"
          onAdd={(label) => addInteraction(ENGAGEMENT_KIND_MAP[label])}
        />

        <InteractionSection title="Navigation" items={navigation} />

        <SocialSection
          title="Social"
          items={social}
          onAdd={(platform) => addInteraction("social", platform)}
        />

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


interface InteractionSectionProps {
  title: string;
  items: InteractionItem[];
  badgeLabel?: string;
  onAdd?: (label: string) => void;
}

const InteractionSection: React.FC<InteractionSectionProps> = ({
  title,
  items,
  badgeLabel,
  onAdd,
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
          <InteractionCard
            key={item.label}
            {...item}
            pro={!!badgeLabel || item.pro}
            onClick={onAdd ? () => onAdd(item.label) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

const InteractionCard: React.FC<InteractionItem & { onClick?: () => void }> = ({
  label,
  icon: Icon,
  dashed,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
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


interface SocialSectionProps {
  title: string;
  items: SocialItem[];
  onAdd: (platform: string) => void;
}

const SocialSection: React.FC<SocialSectionProps> = ({
  title,
  items,
  onAdd,
}) => {
  return (
    <div className="space-y-2">
      <div className="px-1">
        <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <SocialCard
            key={item.label}
            {...item}
            onClick={() => onAdd(item.label)}
          />
        ))}
      </div>
    </div>
  );
};

const SocialCard: React.FC<SocialItem & { onClick: () => void }> = ({
  label,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors aspect-square"
    >
      <Icon className="w-5 h-5 text-gray-700" />
    </button>
  );
};

export default InteractionPanel;
