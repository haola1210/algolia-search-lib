import { createRoot } from "react-dom/client";
import "./index.scss";
import {
  SearchPage,
  SearchModal,
  SearchPageProps,
  SearchModalProps,
} from "./App.tsx";

function renderSearchPage(id: string, props: SearchPageProps) {
  const container = document.getElementById(id);
  if (container) {
    createRoot(container).render(<SearchPage {...props} />);
  }
}
function renderSearchModal(id: string, props: SearchModalProps) {
  const container = document.getElementById(id);
  if (container) {
    createRoot(container).render(<SearchModal {...props} />);
  }
}

function renderController(
  id: string,
  searchPageProps: SearchPageProps,
  searchModalProps: SearchModalProps
) {
  const searchPagePathnames = [
    new URL(searchModalProps.targetUrl).pathname,
    `${new URL(searchModalProps.targetUrl).pathname}.html`,
  ];
  const isSearchPage = searchPagePathnames.includes(window.location.pathname);
  if (isSearchPage) {
    if (searchPageProps.resultPortalElement) {
      searchPageProps.resultPortalElement.classList.add("tw-root"); // Add tw-root to get the base css
    }
    renderSearchPage(id, searchPageProps);
  } else {
    renderSearchModal(id, searchModalProps);
  }
}

// renderController(
//   "root",
//   {
//     // targetUrl: `${window.location.origin}/search`,
//     resultPortalElement: document.getElementById("result-container")!,
//   },
//   {
//     targetUrl: `${window.location.origin}/search`,
//   }
// );

export const AlgoliaSearch = {
  // renderSearchPage,
  // renderSearchModal,
  renderController,
};
