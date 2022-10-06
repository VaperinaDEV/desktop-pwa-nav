import { withPluginApi } from "discourse/lib/plugin-api";
import { observes } from "discourse-common/utils/decorators";

export default {
  name: "desktop-pwa-nav",

  initialize(container) {
    withPluginApi("0.8.13", (api) => {
      const site = api.container.lookup("site:main");
      this.capabilities = container.lookup("capabilities:main");

      const isDesktopPwa = this.capabilities.isPwa && !site.isMobileDevice && !site.mobileView;
      
      if (isDesktopPwa) {
        const applicationController = api.container.lookup("controller:application");
        applicationController.set("showFooterNav", true);
        document.body.classList.add("pwa-footer-nav");
      }
      
      api.modifyClass("component:footer-nav", {
        pluginId: "pwa-navigation",
        @observes("currentRouteIndex")
        setBackForward() {
          let index = this.currentRouteIndex;

          this.set("canGoBack", index > 0 || document.referrer ? true : false);
          this.set("canGoForward", index < this.routeHistory.length ? true : false);
        }
      });
    
      api.reopenWidget("footer-nav", {
        html(attrs) {
          const buttons = [];

          buttons.push(
            this.attach("flat-button", {
              action: "goBack",
              icon: "chevron-left",
              className: "btn-large",
              disabled: !attrs.canGoBack,
              title: "footer_nav.back",
            })
          );

          buttons.push(
            this.attach("flat-button", {
              action: "goForward",
              icon: "chevron-right",
              className: "btn-large",
              disabled: !attrs.canGoForward,
              title: "footer_nav.forward",
            })
          );

          if (this.capabilities.isAppWebview) {
            buttons.push(
              this.attach("flat-button", {
                action: "share",
                icon: "link",
                className: "btn-large",
                title: "footer_nav.share",
              })
            );

            buttons.push(
              this.attach("flat-button", {
                action: "dismiss",
                icon: "chevron-down",
                className: "btn-large",
                title: "footer_nav.dismiss",
              })
            );
          }

          return buttons;
        },
      });
    });
  },
};
