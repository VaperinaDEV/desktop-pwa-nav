import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "pwa-nav",

  initialize(container) {
    withPluginApi("0.8.13", (api) => {
      const site = api.container.lookup("site:main");
      this.capabilities = container.lookup("capabilities:main");

      const isDesktop = this.capabilities.isPwa &&
                        !this.capabilities.isIpadOS &&
                        !this.capabilities.isAndroid &&
                        !this.capabilities.isWinphone &&
                        !site.isMobileDevice &&
                        !site.mobileView;
      
      if (isDesktop) {
        const applicationController = api.container.lookup("controller:application");
        applicationController.set("showFooterNav", true);
        document.body.classList.add("pwa-footer-nav");
      }

      api.reopenWidget("footer-nav", {
        html(attrs) {
          const buttons = [];

          if (!isDesktop) {
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
          }

          if (isDesktop) {
            buttons.push(
              this.attach("flat-button", {
                action: "goBack",
                icon: "chevron-left",
                className: "btn-large",
                title: "footer_nav.back",
              })
            );

            buttons.push(
              this.attach("flat-button", {
                action: "goForward",
                icon: "chevron-right",
                className: "btn-large",
                title: "footer_nav.forward",
              })
            );
          }

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
