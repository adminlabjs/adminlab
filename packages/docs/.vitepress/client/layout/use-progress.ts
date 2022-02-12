import { Loading, LoadingBar, QSpinnerAudio, useQuasar } from "quasar";
import { watch } from "vue";
import { useRoute } from "vitepress";

export const useProgress = () => {
  const pushState = history.pushState;

  if (!pushState) return;

  const route = useRoute();
  const $q = useQuasar();

  let loading = false;

  const start = () => {
    if (loading) return;
    loading = true;

    if ($q.platform.is.mobile) {
      Loading.show();
    } else {
      LoadingBar.start()
    }
  }

  const end = () => {
    loading = false;
    LoadingBar.stop();
    Loading.hide();
  }

  LoadingBar.setDefaults({
    size: "5px",
    color: "light-blue-3"
  })

  Loading.setDefaults({
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    spinner: QSpinnerAudio,
    spinnerSize: 30,
    spinnerColor: "light-blue-3"
  })

  const setCurrentUrl = (url?: string) => currentUrl = url || decodeURIComponent(location.href);

  let currentUrl = "";
  setCurrentUrl();

  watch(() => route.path, (path: string) => {
    if (location.href.indexOf(path) > -1) {
      if (location.href.indexOf("#") === -1) {
        window.scrollTo(0, 0);
      }

      end();
    }
  })

  history.pushState = (...args: any[]) => {
    pushState.apply(window.history, args);

    const newUrl = decodeURIComponent(location.href);

    if (currentUrl.split("#")[0] !== newUrl.split("#")[0]) {
      setCurrentUrl(newUrl);
      start();
    }

  }

  window.addEventListener("popstate", (e) => {
    setCurrentUrl();

    if (currentUrl.indexOf(route.path) > -1) {
      end();
    } else {
      start();
    }
  })
}
