import { watchEffect, ref, getCurrentInstance } from "vue";
import { useData } from "vitepress";
import type { PageData } from "vitepress";

type TocList = PageData["headers"];

export const useScroll = () => {
  const vm = getCurrentInstance();
  const { location } = window;

  const getModelValue = () => vm.attrs.modelValue;

  const activeToc = ref("");
  const tocList = ref<TocList>([]);

  const data = useData();

  const updateTocList = (list: TocList) => (tocList.value = list);

  let goTo: number;

  const scrollTo = (toc: string) => {
    goTo = 0;

    if (!toc || activeToc.value === toc) return;

    const el = document.getElementById(toc);

    if (el) {
      const scrollTop = el.offsetTop;
      goTo = scrollTop;
      updateActiveToc(toc);

      window.scrollTo({
        left: el.offsetLeft || 0,
        top: scrollTop,
        behavior: "smooth",
      });

      window.addEventListener("keydown", onkeydown);
    }
  };

  watchEffect(() => {
    const page = data.page.value;
    if (page) {
      updateTocList(page.headers || []);
    }
  });

  const getHash = () => {
    return decodeURIComponent(location.hash || "").slice(1);
  };

  const refreshHash = () => (activeToc.value = getHash());

  const updateActiveToc = (toc: string) => {
    activeToc.value = toc;

    const { origin, pathname } = location;
    history.replaceState(
      null,
      document.title,
      `${origin}${pathname}${toc ? `#${toc}` : ""}`
    );
  };

  const onkeydown = (event: Event) => {
    event.preventDefault();
  };

  refreshHash();

  // todo: 节流或移动端节流
  window.addEventListener("scroll", () => {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    
    if (getModelValue() && !scrollTop) return;

    if (goTo) {
      const reset = () => {
        goTo = 0;
        window.removeEventListener("keydown", onkeydown);
      };

      if (scrollTop === goTo) return reset();

      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      const max = scrollHeight - window.innerHeight;

      if (goTo >= max && scrollTop >= max) reset();

      return;
    }

    refreshHash();

    const _tocList = tocList.value;

    let hash = "";

    for (let i = 0; i < _tocList.length; i++) {
      const { slug } = _tocList[i];

      const el = document.getElementById(slug);

      if (el) {
        if (scrollTop >= el.offsetTop - 50) {
          hash = slug;
        }
      }
    }

    updateActiveToc(hash);
  });

  return {
    activeToc,
    tocList,
    scrollTo,
  };
};
