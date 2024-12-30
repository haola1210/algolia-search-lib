/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Hit } from "algoliasearch";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  // DynamicWidgets,
  Highlight,
  Hits,
  HitsPerPage,
  InstantSearch,
  Menu,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch";
import "instantsearch.css/themes/algolia.css";
import "reactjs-popup/dist/index.css";
import "./App.css";
import { HitDto } from "./types";
import { createPortal } from "react-dom";
import Popup from "reactjs-popup";
import { useCallback, useRef } from "react";

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
      className="tw-gap-2 !tw-flex !tw-flex-row lg:!tw-flex-col tw-w-full"
      title={hit.title}
    >
      {/* <img src={hit.image} alt={hit.title} /> */}
      <img
        src={`https://www.cases2go.com${hit.image}`}
        alt={hit.title}
        className="tw-w-28  lg:tw-w-52 tw-aspect-square tw-object-contain"
      />
      <section className="">
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
        <p className="tw-text-base tw-italic">{hit.manufacturer}</p>
        <p className="tw-text-base tw-font-bold tw-text-black">
          <span className="!tw-text-yellow-400 tw-text-sm">$</span>
          {hit.price}
        </p>
      </section>
    </a>
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
        indexName="product_index"
        initialUiState={{
          product_index: (() => {
            const params = new URLSearchParams(window.location.search);
            const initialQuery = params.get("query") || "";
            return {
              query: initialQuery,
            };
          })(),
        }}
      >
        <div className="tw-flex tw-justify-center">
          <SearchBox
            className="tw-max-w-96 tw-minw-80 tw-w-full"
            classNames={{
              input: "tw-h-12",
            }}
          />
        </div>
        {!resultPortalElement && (
          <>
            <div className="tw-flex tw-flex-row">
              {showSideBar && (
                <div className="lg:!tw-flex-col tw-hidden lg:!tw-flex tw-pt-4 tw-gap-4 tw-min-w-60">
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
              <h6 className="tw-text-xl tw-font-bold">Category</h6>
              <RefinementList attribute="categories.name" showMore searchable />
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
    </div>,
    resultPortalElement!
  );
}

export interface SearchModalProps {
  targetUrl: string;
}

export function SearchModal({ targetUrl }: SearchModalProps) {
  const queryRef = useRef("");
  const nagivate = useCallback(() => {
    const url = new URL(targetUrl);
    url.searchParams.set("query", queryRef.current);
    window.location.href = url.toString();
  }, [targetUrl]);

  return (
    <Popup
      modal
      trigger={
        <div className="tw-bg-white tw-relative tw-max-w-96 tw-min-w-80 tw-w-full tw-h-12 tw-rounded-[5px] [border:1px_solid_rgb(196,200,216)]">
          <svg
            className="tw-w-[14px] tw-h-[14px] tw-absolute tw-top-1/2  tw-translate-x-1/2 -tw-translate-y-1/2"
            width="10"
            height="10"
            viewBox="0 0 40 40"
            aria-hidden="true"
          >
            <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
          </svg>
        </div>
      }
      position={"center center"}
    >
      <div className="tw-p-4 tw-h-full">
        <InstantSearch
          searchClient={searchClient}
          indexName="product_index"
          onStateChange={({ uiState, setUiState }) => {
            //@ts-expect-error
            queryRef.current = uiState.product_index.query;
            setUiState(uiState);
          }}
        >
          <div className="tw-flex tw-flex-col tw-h-full">
            <div className="tw-flex tw-justify-center">
              <SearchBox
                className="tw-max-w-96 tw-minw-80 tw-w-full"
                onSubmit={nagivate}
                classNames={{
                  input: "tw-h-12",
                }}
              />
            </div>
            <div className="tw-italic tw-text-base tw-p-4 tw-pb-0 tw-pt-2">
              <span className="tw-not-italic tw-font-bold tw-underline">
                Tip
              </span>
              : Press{" "}
              <span className="tw-not-italic tw-font-bold tw-text-red-600">
                Enter
              </span>{" "}
              or click{" "}
              <span
                onClick={nagivate}
                className="tw-font-bold tw-text-sky-600 tw-underline tw-cursor-pointer"
              >
                here
              </span>{" "}
              to go to the advanced search page.
            </div>

            <div className="tw-p-4 tw-pt-8 tw-pl-8 tw-overflow-auto tw-flex-grow tw-my-4">
              <Hits<HitDto>
                hitComponent={HitComponent}
                classNames={{
                  list: "custom-hit-list",
                  item: "custom-hit-item",
                }}
              />
            </div>
            <div className="tw-flex tw-flex-row tw-gap-4 tw-justify-end">
              <Pagination showFirst={false} showLast={false} padding={1} />
            </div>
          </div>
        </InstantSearch>
      </div>
    </Popup>
  );
}
