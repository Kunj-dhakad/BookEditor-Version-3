"use client";
import React, {
  // startTransition,
  // useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import MiniSlidePreview from "./MiniSlidePreview";
import SortableSlide from "./SortableSlide";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import useEditorStore, { SlideType } from "@/app/Store/editorStore";
import MoreOptions from "./MoreOptions";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type SidebarSlidesProps = {
  activeSlide: number;
  addSlide: () => void;
  jumpToSlide: (i: number) => void;
};

interface SlideItemProps {
  slide: SlideType;
  index: number;
  isActive: boolean;
  onJumpToSlide: (index: number) => void;
  openMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
}

const SlideItem = memo(
  function SlideItem({
    slide,
    index,
    isActive,
    onJumpToSlide,
    openMenuId,
    onToggleMenu,
  }: SlideItemProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const isMenuOpen = openMenuId === slide.id;

    const handleJump = useCallback(() => {
      onJumpToSlide(index);
    }, [onJumpToSlide, index]);

    const handleMenuToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleMenu(isMenuOpen ? null : slide.id);
      },
      [onToggleMenu, isMenuOpen, slide.id]
    );

    return (
      <SortableSlide id={slide.id}>
        <div
          onMouseDown={handleJump}
          className={`group relative transition-all kd-slide-preview ${isActive ? "kd-slide-preview-active" : ""
            }`}
        >
          <div className="text-[11px] kd-text-muted select-none">
            <MiniSlidePreview slide={slide} />
          </div>

          <div
            className={`absolute top-2 right-2 flex z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${isActive ? "opacity-100" : ""
              }`}
          >
            <button
              ref={buttonRef}
              // onClick={handleMenuToggle}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleMenuToggle}
              className="kd-icon-btn-main"
            >
              <BiDotsVerticalRounded />
            </button>
          </div>


          {isMenuOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <MoreOptions
                targetRef={buttonRef}
                onClose={() => onToggleMenu(null)}
                slideId={slide.id}
              />,
              document.body
            )}
        </div>
      </SortableSlide>
    );
  },
  (prev, next) => {
    const prevMenuOpen = prev.openMenuId === prev.slide.id;
    const nextMenuOpen = next.openMenuId === next.slide.id;
    return (
      // prev.slide === next.slide &&
      // new add
      prev.slide.width === next.slide.width &&
      prev.slide.height === next.slide.height &&
      prev.slide.background === next.slide.background &&
      prev.slide.elements === next.slide.elements &&
      //new add end  
      prev.isActive === next.isActive &&
      prevMenuOpen === nextMenuOpen &&
      prev.index === next.index
    );
  }
);

const ACTIVATION_CONSTRAINT = { distance: 8 };

export default function Preview({
  // slides,
  activeSlide,
  addSlide,
  jumpToSlide,
}: SidebarSlidesProps) {
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   startTransition(() => setMounted(true));
  // }, []);
  const slides = useEditorStore((s) => s.slides);

  const reorderSlides = useEditorStore((s) => s.reorderSlides);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: ACTIVATION_CONSTRAINT }),
    useSensor(TouchSensor, { activationConstraint: ACTIVATION_CONSTRAINT })
  );

  const handleToggleMenu = useCallback((id: string | null) => {
    setOpenMenuId(id);
  }, []);

  const slideIds = useMemo(() => slides.map((s) => s.id), [slides]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      const oldIndex = slideIds.indexOf(String(active.id));
      const newIndex = slideIds.indexOf(String(over.id));
      if (oldIndex !== newIndex) {
        reorderSlides(oldIndex, newIndex);
        setActiveSlide(newIndex);
        jumpToSlide(newIndex);
      }
    },
    [slideIds, reorderSlides, setActiveSlide, jumpToSlide]
  );


  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="kd-btn z-50 toggle-btn cursor-pointer"
        >
          Open Panel
        </button>
      )}

      <aside
        className={`w-[155px] flex flex-col min-h-0 flex-1 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+10%)]"
          }`}
      >
        {/* <div className="p-2 flex items-center justify-center">
          <button
            onClick={addSlide}
            className="kd-left-sidebar-add w-full p-2 rounded text-sm"
          >
            <FontAwesomeIcon icon={faPlus} /> Add New
          </button>
        </div> */}

        <DndContext
          id="editor-slide-sortable"
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slideIds}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="flex flex-col items-center gap-1 overflow-y-auto kd-custom-scrollbar flex-1 min-h-0 w-full"
              style={{
                overscrollBehaviorY: "contain",
                willChange: "transform",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {slides.map((slide, index) => (
                <SlideItem
                  key={slide.id}
                  slide={slide}
                  index={index}
                  isActive={index === activeSlide}
                  onJumpToSlide={jumpToSlide}
                  openMenuId={openMenuId}
                  onToggleMenu={handleToggleMenu}
                />
              ))}

              <div className="p-2 flex items-center justify-center">
                <button
                  onClick={addSlide}
                  className="kd-left-sidebar-add w-full p-2 rounded text-sm"
                >
                 <FontAwesomeIcon icon={faPlus} /> Add New
                </button>
              </div>
            </div>
          </SortableContext>
        </DndContext>


      </aside>
    </>
  );
}
