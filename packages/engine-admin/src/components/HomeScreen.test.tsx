import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeScreen } from "./HomeScreen.js";

describe("HomeScreen", () => {
  it("shows page, image and last-edited stats", () => {
    render(
      <HomeScreen
        businessName="SplashNSwim"
        stats={{
          totalPages: 6,
          publishedPages: 5,
          totalImages: 14,
          lastEdited: { title: "Pricing", relativeTime: "2h ago" },
        }}
        newPageHref="/admin/pages"
        uploadImagesHref="/admin/media"
        broadcastHref="/admin/broadcast"
      />,
    );
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText(/5 published/)).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText(/Pricing/)).toBeInTheDocument();
  });

  it("shows a fallback when nothing has been edited yet", () => {
    render(
      <HomeScreen
        businessName="SplashNSwim"
        stats={{ totalPages: 0, publishedPages: 0, totalImages: 0, lastEdited: null }}
        newPageHref="/admin/pages"
        uploadImagesHref="/admin/media"
        broadcastHref="/admin/broadcast"
      />,
    );
    expect(screen.getByText("No edits yet")).toBeInTheDocument();
  });

  it("links each quick action to the right place", () => {
    render(
      <HomeScreen
        businessName="SplashNSwim"
        stats={{ totalPages: 0, publishedPages: 0, totalImages: 0, lastEdited: null }}
        newPageHref="/admin/pages"
        uploadImagesHref="/admin/media"
        broadcastHref="/admin/broadcast"
      />,
    );
    expect(screen.getByRole("link", { name: "New page" })).toHaveAttribute(
      "href",
      "/admin/pages",
    );
    expect(screen.getByRole("link", { name: "Upload images" })).toHaveAttribute(
      "href",
      "/admin/media",
    );
    expect(screen.getByRole("link", { name: "Send broadcast" })).toHaveAttribute(
      "href",
      "/admin/broadcast",
    );
  });
});
