"use client";

import { useEffect } from "react";

function smoothScrollTo(top: number, duration: number) {
  const start = window.scrollY;
  const distance = top - start;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = Math.min((currentTime - startTime) / duration, 1);
    const eased = elapsed < 0.5
      ? 2 * elapsed * elapsed
      : 1 - Math.pow(-2 * elapsed + 2, 2) / 2;

    window.scrollTo(0, start + distance * eased);

    if (elapsed < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

export default function ArticleEffects() {
  useEffect(() => {
    const stickySidebar = document.querySelector<HTMLElement>(".sticky-sidebar");
    const wrapSidebar = stickySidebar?.closest<HTMLElement>(".article__sidebar");
    const topOffset = 56;
    let ticking = false;

    if (!stickySidebar || !wrapSidebar) return;

    const sticky = stickySidebar;
    const sidebar = wrapSidebar;
    function resetStickySidebar() {
      sticky.style.transform = "";
      sticky.style.willChange = "";
    }

    function updateStickySidebar() {
      if (window.innerWidth <= 800) {
        resetStickySidebar();
        return;
      }

      const sidebarTop = sidebar.getBoundingClientRect().top + window.scrollY;
      const sidebarHeight = sidebar.offsetHeight;
      const stickyStartTop = sticky.offsetTop;
      const stickyHeight = sticky.offsetHeight;
      const maxOffset = Math.max(0, sidebarHeight - stickyStartTop - stickyHeight);
      const nextOffset = Math.round(Math.min(
        Math.max(0, window.scrollY + topOffset - sidebarTop - stickyStartTop),
        maxOffset
      ));

      sticky.style.willChange = "transform";
      sticky.style.transform = `translate3d(0, ${nextOffset}px, 0)`;
    }

    function requestUpdate() {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        updateStickySidebar();
        ticking = false;
      });
    }

    updateStickySidebar();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", updateStickySidebar);

    const resizeObserver = new ResizeObserver(() => {
      updateStickySidebar();
    });

    resizeObserver.observe(sidebar);
    resizeObserver.observe(sticky);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("load", updateStickySidebar);
      resizeObserver.disconnect();
      resetStickySidebar();
    };
  }, []);

  useEffect(() => {
    const tocMain = document.querySelector<HTMLElement>(".toc-main");

    if (!tocMain) return;

    const article = document.querySelector<HTMLElement>(".article");
    const tocBlock = tocMain.querySelector<HTMLElement>(".toc__block");
    const tocShow = tocMain.querySelector<HTMLButtonElement>(".toc__show");

    if (!article || !tocBlock || !tocShow) return;

    const block = tocBlock;
    const showButton = tocShow;

    const headers = Array.from(
      article.querySelectorAll<HTMLElement>(".article h2, .article h3, .article h4, .article h5")
    ).filter((item) => !item.classList.contains("no-toc"));

    if (!headers.length) {
      tocMain.classList.add("hidden");
      return;
    }

    let isScrolling = false;
    const ul = document.createElement("ul");
    const tocItems = headers.map((header, index) => {
      const li = document.createElement("li");
      const link = document.createElement("a");

      li.classList.add("toc__item");

      if (!header.id) {
        header.id = `heading-id-${index}`;
      }

      link.href = `#${header.id}`;
      link.textContent = header.textContent || "";
      link.classList.add("toc__link");
      li.appendChild(link);
      ul.appendChild(li);

      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (isScrolling) return;

        const targetElement = document.getElementById(header.id);

        if (!targetElement) return;

        const offsetFromTop = targetElement.getBoundingClientRect().top + window.scrollY - 24;

        isScrolling = true;
        smoothScrollTo(offsetFromTop, 1000);
        window.setTimeout(() => {
          isScrolling = false;
          updateActiveLink();
        }, 500);
      });

      return { header, tocItem: li };
    });

    ul.classList.add("toc__list");
    block.prepend(ul);

    function updateActiveLink() {
      if (isScrolling || !tocItems.length) return;

      let index = 0;
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;

      tocItems.forEach((item, i) => {
        if (item.header.offsetTop <= scrollPosition) {
          index = i;
        }
      });

      tocItems.forEach((item) => item.tocItem.classList.remove("active"));
      tocItems[index]?.tocItem.classList.add("active");
    }

    function toggleTOC(event: MouseEvent) {
      if (window.innerWidth < 1000) {
        const target = event.currentTarget as HTMLButtonElement;
        target.classList.toggle("hide");
        block.classList.toggle("hidden");
      }
    }

    function hiddenTOC() {
      if (window.innerWidth > 1000) {
        showButton.classList.remove("hide");
        block.classList.remove("hidden");
      } else {
        showButton.classList.add("hide");
        block.classList.add("hidden");
      }
    }

    updateActiveLink();
    hiddenTOC();

    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("resize", hiddenTOC);
    showButton.addEventListener("click", toggleTOC);

    return () => {
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("resize", hiddenTOC);
      showButton.removeEventListener("click", toggleTOC);
      ul.remove();
      tocMain.classList.remove("hidden");
    };
  }, []);

  return null;
}
