"use client";
import React, { useEffect, useMemo, 
    // useRef, 
    useState } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
// import { ChevronsLeft, ChevronsRight } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import useProjectInfoStore from "@/app/Store/projectInfoStore";
interface ElementItem {
    id: number;
    thumbnail_url: string;
    title: string;
    template_category: string;
    json: string;
    json_url: string;
}

// const CATEGORIES = [
//     "All", "Digital marketing",
//     "Advertisement", "Ecommerce", "Learning & Development",
//     "Explainer Video", "Social Media",
// ];

const TemplateAddPanel: React.FC<{ Addtype?: string }> = ({ }) => {
    const [elements, setElements] = useState<ElementItem[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    // const categoryRef = useRef<HTMLDivElement>(null);

    const token = useProjectInfoStore((s) => s.token);
    const api_url = useProjectInfoStore((s) => s.api_url);
    useEffect(() => {
        (async () => {
            try {
                const formData = new FormData();
                formData.append("access_token", token || "");
                formData.append("search_temp", search);

                const res = await fetch(`${api_url}sl_editor_template_listing`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    console.error("API Error:", res.status);
                    setElements([]);
                    return;
                }

                const data = await res.json();
                const list = Array.isArray(data?.result) ? data.result : [];
                setElements(list);
            } catch (err) {
                console.error("Fetch failed:", err);
                setElements([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [api_url, search, token]);


    async function loadTemplate(url: string) {
        try {
            const res = await fetch(url);
            let json = await res.json();

            if (typeof json === "string") {
                try {
                    json = JSON.parse(json);
                } catch (e) {
                    console.error("Inner JSON parse failed", e);
                }
            }

            const modern = json;

            if (!modern?.slides) {
                console.error("Invalid template structure", json);
                return;
            }

            useEditorStore.getState().applyFullTemplate(modern.slides);

        } catch (err) {
            console.error("Error loading template:", err);
        }
    }

    const filtered = useMemo(() => {
        return elements.filter((el) => {
            const s = el.title?.toLowerCase().includes(search.toLowerCase());
            const c =
                activeCategory === "All" || el.template_category === activeCategory;
            return s && c;
        });
    }, [elements, search, activeCategory]);
    const grouped = useMemo(() => {
        const map = new Map<string, ElementItem[]>();
        filtered.forEach((el) => {
            if (!map.has(el.template_category)) map.set(el.template_category, []);
            map.get(el.template_category)!.push(el);
        });
        return Array.from(map.entries());
    }, [filtered]);

    // const scrollCategory = (dir: "left" | "right") => {
    //     categoryRef.current?.scrollBy({
    //         left: dir === "left" ? -160 : 160,
    //         behavior: "smooth",
    //     });
    // };

    return (
        <div className="kd-element-panel w-full h-full   px-2 flex flex-col overflow-hidden" >

            <div className="flex items-center justify-between  my-3">
                <span className="kd-toolPanel-heding-text">
                    Templates
                </span>
            </div>
            <div className="w-full kd-toolPanel-hr-devide-border mb-2" />


            {/* HEADER */}
            <div className="kd-element-header mt-2  space-y-2">
                {/* <div className="kd-toolPanel-sub-heding-text">Search a Templates</div> */}

                {/* Search */}
                <div className="kd-search-box flex items-center gap-2 px-3 py-2 rounded-lg">
                    <FaSearch className="kd-icon-text text-sm" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Templates..."
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>
                <div className="w-full kd-toolPanel-hr-devide-border mb-2" />

{/* 
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

                </div> */}
            </div>

            {/* CONTENT */}
            <div
                className="flex-1 px-3 space-y-6 overflow-y-auto kd-custom-scrollbar"
            >

                {loading && (
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg border border-gray-200 p-3">
                                <div className="w-full h-full flex items-center justify-center animate-pulse">
                                    <div className="w-full h-full rounded bg-gray-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading &&
                    grouped.map(([category, items]) => (
                        <div key={category} className="space-y-3 ">
                            {/* <div className="kd-element-section-title mt-2">
                                {category}
                            </div> */}

                            <div className="grid grid-cols-2 gap-3">
                                {items.map((el) => (
                                    <div
                                        key={el.id}
                                        onClick={() => loadTemplate(el.json_url)}
                                        draggable
                                        onDragStart={(e) =>
                                            e.dataTransfer.setData(
                                                "application/image-src",
                                                el.thumbnail_url
                                            )
                                        }
                                        className="Kd-add-template-card p-1 flex items-center justify-center  cursor-pointer"
                                    >
                                        <Image
                                            src={el.thumbnail_url}
                                            alt={el.title}
                                            width={64}
                                            height={64}
                                            unoptimized
                                            className="sobject-contain Kd-add-template-card-img"
                                            onDragStart={(e) => {
                                                if (el.template_category === "Shapes") {
                                                    e.dataTransfer.setData("application/element", "shape");
                                                    e.dataTransfer.setData("application/shape-svg", el.thumbnail_url);
                                                } else {
                                                    e.dataTransfer.setData("application/element", "image");
                                                    e.dataTransfer.setData("application/image-src", el.thumbnail_url);
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

export default TemplateAddPanel;
