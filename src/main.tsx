import { createRoot } from "react-dom/client";
import "./index.css";
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
export const AlgoliaSearch = {
  renderSearchPage,
  renderSearchModal,
};
