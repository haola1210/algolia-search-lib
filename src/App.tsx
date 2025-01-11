/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Hit } from "algoliasearch";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import * as Slider from "@radix-ui/react-slider";

import {
  Configure,
  Highlight,
  Hits,
  HitsPerPage,
  InstantSearch,
  Menu,
  Pagination,
  RefinementList,
  SearchBox,
  useClearRefinements,
  UseClearRefinementsProps,
  useCurrentRefinements,
  UseCurrentRefinementsProps,
  useMenu,
  UseMenuProps,
  useRange,
  useRefinementList,
  UseRefinementListProps,
} from "react-instantsearch";
import "instantsearch.css/themes/algolia.css";
import "reactjs-popup/dist/index.css";
import "./App.css";
import { HitDto } from "./types";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const appID = import.meta.env.VITE_APP_ID;
const apiKey = import.meta.env.VITE_API_KEY;
const searchClient = algoliasearch(appID, apiKey);

interface HitComponentProps {
  hit: Hit<HitDto>;
}

function HitComponent({ hit }: HitComponentProps) {
  return (
    <a
      href={hit.url}
      className="tw-gap-2 !tw-flex !tw-flex-row lg:!tw-flex-col tw-w-full tw-h-full"
      title={hit.title}
    >
      {/* <img src={hit.image} alt={hit.title} /> */}
      <img
        src={`https://www.cases2go.com${hit.image}`}
        alt={hit.title}
        className="tw-w-28  lg:tw-w-52 tw-aspect-square tw-object-contain"
      />
      <section className="tw-grow tw-flex-col tw-flex">
        <p className="tw-text-zinc-700 tw-opacity-80 tw-font-semibold tw-text-base tw-uppercase tw-pb-1">
          {hit.categories?.[0]?.name}
        </p>

        <h5 className="tw-text-lg tw-font-bold tw-line-clamp-2 tw-w-full">
          <Highlight
            attribute="title"
            // @ts-expect-error
            hit={hit}
            classNames={{
              highlighted: "tw-text-lg",
              nonHighlighted: "tw-text-lg",
            }}
          />
        </h5>
        <p className="tw-text-base tw-italic">
          {/* {hit.manufacturer} */}
          <Highlight
            attribute="manufacturer"
            // @ts-expect-error
            hit={hit}
            classNames={{
              highlighted: "tw-text-base",
              nonHighlighted: "tw-text-base",
            }}
          />
        </p>
        <p className="tw-text-base tw-font-bold tw-text-black">
          <span className="!tw-text-sky-600 tw-text-sm">MPN:</span>{" "}
          {/* {hit.manufacturerPartNumber} */}
          <Highlight
            attribute="manufacturerPartNumber"
            // @ts-expect-error
            hit={hit}
            classNames={{
              highlighted: "tw-text-base",
              nonHighlighted: "tw-text-base",
            }}
          />
        </p>
        <p className="tw-text-sm tw-font-bold tw-text-black">
          <span className="!tw-text-sky-600">SKU:</span>{" "}
          <Highlight
            attribute="sku"
            // @ts-expect-error
            hit={hit}
            classNames={{
              highlighted: "tw-text-sm",
              nonHighlighted: "tw-text-sm",
            }}
          />
        </p>
        {hit.attr_dimension && (
          <p className="tw-text-base tw-font-bold tw-text-black">
            <span className="!tw-text-sky-600 tw-text-sm">Size:</span>{" "}
            {/* {hit.attr_dimension} */}
            <Highlight
              attribute="attr_dimension"
              // @ts-expect-error
              hit={hit}
              classNames={{
                highlighted: "tw-text-base",
                nonHighlighted: "tw-text-base",
              }}
            />
          </p>
        )}
        <p className="tw-text-base tw-font-bold tw-text-black tw-mt-auto">
          <span className="!tw-text-yellow-400 tw-text-sm">$</span>
          {hit.price}
        </p>
      </section>
    </a>
  );
}

interface RangeSliderProps {
  attribute: string;
  label: string;
}

export function RangeSlider({ attribute, label }: RangeSliderProps) {
  const { start, range, canRefine, refine } = useRange({ attribute });
  const { min, max } = range;
  const [value, setValue] = useState([min ?? 0, max ?? 0]);

  const from = Math.max(
    min ?? 0,
    Number.isFinite(start[0]) ? start[0] ?? 0 : min ?? 0
  );
  const to = Math.min(
    max ?? 0,
    Number.isFinite(start[1]) ? start[1] ?? 0 : max ?? 0
  );

  useEffect(() => {
    setValue([from, to]);
  }, [from, to]);

  return (
    <div className="tw-flex tw-w-full tw-pb-4">
      <span className="tw-text-sm tw-pr-2 tw-min-w-[51px]">{label}</span>
      <Slider.Root
        min={min}
        max={max}
        value={value}
        onValueChange={setValue}
        //@ts-expect-error
        onValueCommit={refine}
        disabled={!canRefine}
        className="tw-relative tw-flex tw-h-5 tw-w-full tw-touch-none tw-select-none tw-items-center"
      >
        <Slider.Track className="tw-relative tw-h-[3px] tw-grow tw-rounded-full tw-bg-white">
          <Slider.Range className="tw-absolute tw-h-full tw-rounded-full tw-bg-sky-600" />
        </Slider.Track>
        <Slider.Thumb className="slider-thumb tw-block tw-size-5 tw-rounded-[10px] tw-bg-sky-600 " />
        <Slider.Thumb className="slider-thumb tw-block tw-size-5 tw-rounded-[10px] tw-bg-sky-600 " />
      </Slider.Root>
    </div>
  );
}

export interface SearchPageProps {
  showSideBar?: boolean;
  resultPortalElement?: HTMLElement;
}

export function SearchPage({
  showSideBar = true,
  resultPortalElement,
}: SearchPageProps) {
  return (
    <div className="tw-p-4">
      <InstantSearch
        searchClient={searchClient}
        indexName="product_index_2"
        initialUiState={{
          product_index_2: (() => {
            const params = new URLSearchParams(window.location.search);
            const initialQuery = params.get("query") || "";
            return {
              query: initialQuery,
            };
          })(),
        }}
      >
        <Configure
          filters="hide!=1 AND NOT product_status:'Discontinued'"
          optionalFilters={[
            "manufacturer:SKB Cases",
            "categories.name:-Case Accessories",
          ]}
        />
        <div className="tw-flex tw-justify-center">
          <SearchBox
            className="tw-max-w-96 tw-minw-80 tw-w-full"
            classNames={{
              input: "tw-h-12 !tw-px-6",
            }}
            placeholder="Enter search"
          />
        </div>
        {!resultPortalElement && (
          <>
            <div className="tw-flex tw-flex-row">
              {showSideBar && (
                <div className="lg:!tw-flex-col tw-hidden lg:!tw-flex tw-pt-4 tw-gap-4 tw-min-w-60">
                  <div className="tw-flex tw-flex-col tw-gap-2">
                    <h6 className="tw-text-xl tw-font-bold">Size</h6>
                    <RangeSlider attribute="attr_width" label="Width" />
                    <RangeSlider attribute="attr_height" label="Height" />
                    <RangeSlider attribute="attr_depth" label="Depth" />
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2">
                    <h6 className="tw-text-xl tw-font-bold">Category</h6>
                    <RefinementList
                      attribute="categories.name"
                      showMore
                      searchable
                    />
                  </div>
                  {/* <DynamicWidgets facets={["*"]}></DynamicWidgets> */}
                  <div className="tw-flex tw-flex-col tw-gap-2">
                    <h6 className="tw-text-xl tw-font-bold">manufacturer</h6>
                    <Menu attribute="manufacturer" showMore />
                  </div>
                </div>
              )}
              <div className="tw-p-4 tw-pt-8 tw-pl-8">
                <Hits<HitDto>
                  hitComponent={HitComponent}
                  classNames={{
                    list: "custom-hit-list",
                    item: "custom-hit-item",
                  }}
                />
              </div>
            </div>
            <div className="tw-flex tw-flex-row tw-gap-4 tw-justify-end">
              <Pagination showFirst={false} showLast={false} padding={1} />
              <HitsPerPage
                items={[
                  { label: "8 items per page", value: 8, default: true },
                  { label: "16 items per page", value: 16 },
                ]}
              />
            </div>
          </>
        )}
        {resultPortalElement && (
          <PortalUI
            resultPortalElement={resultPortalElement}
            showSideBar={showSideBar}
          />
        )}
      </InstantSearch>
    </div>
  );
}

function CustomClearRefinements(props: UseClearRefinementsProps) {
  const { refine, canRefine } = useClearRefinements(props);

  return (
    <button
      className="tw-border-none tw-bg-sky-600 tw-text-white tw-font-bold tw-px-4 tw-py-1 tw-rounded-lg tw-transition tw-duration-300 hover:tw-bg-sky-700 tw-max-w-max tw-outline-none disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed"
      disabled={!canRefine}
      onClick={(e) => {
        e.preventDefault();
        refine();
      }}
    >
      Clear all
    </button>
  );
}

function CustomCurrentRefinements(props: UseCurrentRefinementsProps) {
  const { items, refine } = useCurrentRefinements(props);

  return (
    <>
      {items.map((item) => (
        <span
          key={[item.indexName, item.label].join("/")}
          className="tw-flex tw-flex-row tw-px-1 tw-py-0.5 tw-rounded-lg tw-bg-slate-400 tw-text-white tw-h-full"
        >
          <span className="tw-font-semibold ">{item.label}:</span>
          {item.refinements.map((refinement) => (
            <span key={refinement.label} className="tw-text-slate-100 tw-ml-2">
              <span className="tw-text-sm tw-underline">
                {refinement.label}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  if (isModifierClick(event)) {
                    return;
                  }

                  refine(refinement);
                }}
                className="tw-ml-0.5 tw-border-none tw-bg-red-600 tw-text-white tw-p-0.5 tw-rounded-lg tw-transition tw-duration-300 hover:tw-bg-red-700 tw-max-w-max tw-outline-none disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed"
              >
                <svg
                  className=""
                  viewBox="0 0 20 20"
                  width="10"
                  height="10"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path>
                </svg>
              </button>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

function isModifierClick(event: React.MouseEvent<HTMLButtonElement>) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}

function PortalUI({ showSideBar, resultPortalElement }: SearchPageProps) {
  const target = useRef(resultPortalElement).current;
  const hasMounted = useRef(false);

  if (!target) return null;
  if (!hasMounted.current) {
    target.innerHTML = "";
    hasMounted.current = true;
  }
  return createPortal(
    <div className="tw-flex tw-flex-col tw-items-end">
      <div className="tw-flex tw-flex-row tw-w-full">
        {showSideBar && (
          <div className="lg:!tw-flex-col tw-hidden lg:!tw-flex tw-pt-4 tw-gap-4 tw-min-w-60">
            <div className="tw-flex tw-flex-col tw-gap-2">
              <h6 className="tw-text-xl tw-font-bold">Size</h6>
              <RangeSlider attribute="attr_width" label="Width" />
              <RangeSlider attribute="attr_height" label="Height" />
              <RangeSlider attribute="attr_depth" label="Depth" />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <h6 className="tw-text-xl tw-font-bold">Category</h6>
              <CustomRefinementList attribute="categories.name" showMore />
            </div>
            {/* <DynamicWidgets facets={["*"]}></DynamicWidgets> */}
            <div className="tw-flex tw-flex-col tw-gap-2">
              <h6 className="tw-text-xl tw-font-bold">Manufacturer</h6>
              <CustomMenu attribute="manufacturer" showMore />
            </div>
          </div>
        )}
        <div className="tw-p-4 tw-pt-8 tw-pl-8">
          <div className="tw-w-full tw-flex tw-flex-row tw-flex-wrap tw-gap-2 tw-mb-4 -tw-mt-4">
            <h6 className="tw-text-xl tw-font-bold">Current Filters:</h6>
            <CustomCurrentRefinements />
            <CustomClearRefinements />
          </div>
          <Hits<HitDto>
            hitComponent={HitComponent}
            classNames={{
              list: "custom-hit-list",
              item: "custom-hit-item",
            }}
          />
        </div>
      </div>
      <div className="tw-flex tw-flex-row tw-gap-4 tw-justify-end tw-p-4">
        <Pagination showFirst={false} showLast={false} padding={1} />
        <HitsPerPage
          items={[
            { label: "8 items per page", value: 8, default: true },
            { label: "16 items per page", value: 16 },
          ]}
          classNames={{
            select: "tw-h-full !tw-px-4",
          }}
        />
      </div>
    </div>,
    resultPortalElement!
  );
}

export interface SearchModalProps {
  targetUrl: string;
}

export function SearchModal({ targetUrl }: SearchModalProps) {
  const nagivate = useCallback(() => {
    window.location.href = targetUrl;
  }, [targetUrl]);

  return (
    <div
      className="tw-bg-white tw-relative tw-max-w-96 tw-min-w-80 tw-w-full tw-h-12 tw-rounded-[5px] [border:1px_solid_rgb(196,200,216)]"
      onClick={nagivate}
    >
      <svg
        className="tw-w-[14px] tw-h-[14px] tw-absolute tw-top-1/2  tw-translate-x-1/2 -tw-translate-y-1/2"
        width="10"
        height="10"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
      </svg>
      <span className="tw-absolute tw-top-1/2 tw-left-6 -tw-translate-y-1/2 tw-text-black/50">
        Enter search
      </span>
    </div>
  );
}

function CustomRefinementList(props: UseRefinementListProps) {
  const {
    items,
    refine,
    searchForItems,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
  } = useRefinementList(props);

  return (
    <>
      <input
        type="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        onChange={(event) => searchForItems(event.currentTarget.value)}
        className="tw-px-4 tw-py-2 tw-rounded-[5px] [border:1px_solid_rgb(196,200,216)] tw-outline-none"
        placeholder="Category name..."
      />
      <ul>
        {items.map((item) => (
          <li key={item.label} className="tw-py-1">
            <label
              className={`tw-text-[#3a4570] ${
                item.isRefined && "tw-font-semibold"
              }`}
            >
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                className="tw-mr-2"
              />
              <span>{item.label}</span>
              <span className="tw-ml-1 tw-bg-[#dfe2ee] tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-lg">
                {item.count}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleShowMore();
        }}
        disabled={!canToggleShowMore}
        className="tw-border-none tw-bg-sky-600 tw-text-white tw-font-bold tw-px-4 tw-py-1 tw-rounded-lg tw-transition tw-duration-300 hover:tw-bg-sky-700 tw-max-w-max tw-outline-none disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed"
      >
        {isShowingMore ? "Show less" : "Show more"}
      </button>
    </>
  );
}

function CustomMenu(props: UseMenuProps) {
  const {
    items,
    refine,
    createURL,
    canToggleShowMore,
    toggleShowMore,
    isShowingMore,
  } = useMenu(props);

  const overrideItems = useMemo(() => {
    let ctgObject: (typeof items)[number] | undefined;
    const ctgIndex = items.findIndex((m) => {
      if (m.value === "Cases2Go") {
        ctgObject = m;
        return true;
      }
      return false;
    });
    if (ctgIndex !== -1 && ctgObject) {
      items.splice(ctgIndex, 1);
      return [ctgObject, ...items] as typeof items;
    }
    return items;
  }, [items]);

  return (
    <>
      <ul>
        {overrideItems.map((item) => (
          <li key={item.label} className="tw-py-1">
            <a
              href={createURL(item.value)}
              onClick={(event) => {
                event.preventDefault();

                refine(item.value);
              }}
              className={`tw-text-[#3a4570] ${
                item.isRefined && "tw-font-semibold"
              }`}
            >
              <span>{item.label}</span>
              <span className="tw-ml-1 tw-bg-[#dfe2ee] tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-lg">
                {item.count}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {props.showMore && (
        <button
          disabled={!canToggleShowMore}
          onClick={(e) => {
            e.preventDefault();
            toggleShowMore();
          }}
          className="tw-border-none tw-bg-sky-600 tw-text-white tw-font-bold tw-px-4 tw-py-1 tw-rounded-lg tw-transition tw-duration-300 hover:tw-bg-sky-700 tw-max-w-max tw-outline-none disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed"
        >
          {isShowingMore ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}
