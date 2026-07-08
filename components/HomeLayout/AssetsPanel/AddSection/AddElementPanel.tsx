"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";

interface ElementItem {
    id: number;
    name: string;
    svg_url: string;
    category: string;
    svg_code: string;
}

const CATEGORIES = [
    "All", "Shapes",
    "Activities", "Banner", "Bubble",
    "Business", "Data & Chart", "Emoji",
    "Finance", "Flags", "Flowchart",
    "Food&Drink", "Graphics",
    "Hand Gesture", "Marketing",
    "Object", "Office",
    "Socialmedia", "Startup",
    "Symbol", "Tech&Web",
    "Urban"
];

const AddElementPanel: React.FC<{ Addtype?: string }> = ({ Addtype }) => {
    const [elements, setElements] = useState<ElementItem[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const categoryRef = useRef<HTMLDivElement>(null);
    const addElement = useEditorStore((s) => s.addElement);
    const selectedId = useEditorStore((s) => s.activeElementId);
    const updateElement = useEditorStore((s) => s.updateElement);
    const { slides, activeSlide } = useEditorStore();
    const canvasWidth = slides[activeSlide]?.width;
    const canvasHeight = slides[activeSlide]?.height;
    const defaultX = canvasWidth ? canvasWidth / 2 - 75 : 100;
    const defaultY = canvasHeight ? canvasHeight / 2 - 75 : 100;
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/elements");

                if (!res.ok) {
                    console.error("API Error:", res.status);
                    setElements([]);
                    return;
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setElements(data);
                } else {
                    console.error("Invalid API response:", data);
                    setElements([]);
                }

            } catch (err) {
                console.error("Fetch failed:", err);
                setElements([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);




    const filtered = useMemo(() => {
        return elements.filter((el) => {
            const s = el.name?.toLowerCase().includes(search.toLowerCase());
            const c =
                activeCategory === "All" || el.category === activeCategory;
            return s && c;
        });
    }, [elements, search, activeCategory]);

    const grouped = useMemo(() => {
        const map = new Map<string, ElementItem[]>();
        filtered.forEach((el) => {
            if (!map.has(el.category)) map.set(el.category, []);
            map.get(el.category)!.push(el);
        });
        return Array.from(map.entries());
    }, [filtered]);

    const addImage = (src: string, category: string, svg_code: string) => {

        if (category === "Shapes") {
            console.log("shape");
            addElement({
                type: "shape",
                shape: svg_code,
                x: defaultX,
                y: defaultY,
                width: 150,
                height: 150,
                opacity: 1,
                rotation: 0,
                zIndex: 1,
            });






        } else {
            if (Addtype === "replace" && selectedId) {
                updateElement(selectedId, { src });
                return;
            }
            addElement({
                type: "svg",
                src,
                x: defaultX,
                y: defaultY,
                width: 150,
                height: 150,
                opacity: 1,
                rotation: 0,
                zIndex: 1,
                fit: "contain",
                isDragging: false,
                animationType: "None",
            });
        }

    };

    const scrollCategory = (dir: "left" | "right") => {
        categoryRef.current?.scrollBy({
            left: dir === "left" ? -160 : 160,
            behavior: "smooth",
        });
    };

    return (
        <div className="kd-element-panel w-full h-full flex flex-col p-2 overflow-hidden">
            <div className="flex items-center justify-between mt-1 mb-2">
                <span className="kd-toolPanel-heding-text">
                    Elements
                </span>
            </div>

            <div className="kd-toolPanel-hr-devide-border mt-1 mb-2" />
            {/* HEADER */}
            <div className="kd-element-header space-y-2">

                {/* Search */}
                <div className="kd-search-box flex items-center gap-2 px-3 py-2 rounded-lg">
                    <FaSearch className="kd-icon-text text-sm" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search elements..."
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>

                {/* Categories */}
                <div className="kd-category-bar relative flex">
                    <button className="pb-2 me-2" onClick={() => scrollCategory("left")}>
                        <ChevronsLeft size={20} />
                    </button>

                    <div
                        ref={categoryRef}
                        className="flex gap-2  kd-scrollbar-x px-1 py-1"
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`kd-category-pill ${activeCategory === cat
                                    ? "kd-category-pill-active"
                                    : ""
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="pb-2 ms-2" onClick={() => scrollCategory("right")}>
                        <ChevronsRight size={20} />
                    </button>

                </div>
            </div>

            {/* CONTENT */}
            <div
                className="flex-1 px-3 space-y-6 overflow-y-auto kd-custom-scrollbar"
            >

                {loading && (
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 28 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg border border-gray-200 p-3">
                                <div className="w-full h-full flex items-center justify-center animate-pulse">
                                    <div className="w-10 h-10 kd-element-card rounded bg-gray-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading &&
                    grouped.map(([category, items]) => (
                        <div key={category} className="space-y-3 ">
                            <div className="kd-element-section-title">
                                {category}
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {items.map((el) => (
                                    <div
                                        key={el.id}
                                        onClick={() => addImage(el.svg_url, el.category, el.svg_code)}
                                        draggable
                                        onDragStart={(e) =>
                                            e.dataTransfer.setData(
                                                "application/image-src",
                                                el.svg_url
                                            )
                                        }
                                        className="kd-element-card flex items-center justify-center aspect-square cursor-pointer"
                                    >
                                        <Image
                                            src={el.svg_url}
                                            alt={el.name}
                                            width={64}
                                            height={64}
                                            unoptimized
                                            className="w-9 h-9 object-contain"
                                            onDragStart={(e) => {
                                                if (el.category === "Shapes") {
                                                    e.dataTransfer.setData("application/element", "shape");
                                                    e.dataTransfer.setData("application/shape-svg", el.svg_code);
                                                } else {
                                                    e.dataTransfer.setData("application/element", "image");
                                                    e.dataTransfer.setData("application/image-src", el.svg_url);
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AddElementPanel;
