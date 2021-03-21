// import Vue from "vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  LogoutOptions,
  PopupConfigOptions,
  PopupLoginOptions,
  RedirectLoginOptions
} from "@auth0/auth0-spa-js";
import { PluginObject } from "vue";

/** Define a default action to perform after authentication */
// const DEFAULT_REDIRECT_CALLBACK = () =>
//   window.history.replaceState({}, document.title, window.location.pathname);

let instance: Vue;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

export interface OAuthUser {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}

@Component
class OAuth extends Vue {
  loading = true;
  isAuthenticated = false;
  user: Partial<OAuthUser> = {};
  auth0Client: Auth0Client | null = null;
  popupOpen = false;
  error: Error | null = null;

  private onRedirectCallback: {
    [key: string]: (isAuthenticated: boolean, ctx: "load" | "popup") => void;
  } = {};
  addCallback(
    key: string,
    fn: (isAuthenticated: boolean, ctx: "load" | "popup") => void
  ) {
    this.onRedirectCallback[key] = fn;
    if (this.auth0Client) {
      fn(this.isAuthenticated, "load");
    }
  }
  rmCallback(key: string) {
    if (key in this.onRedirectCallback) {
      delete this.onRedirectCallback[key];
    }
  }

  @Prop() private authOptions!: Auth0ClientOptions;
  @Prop() private redirectUri!: string;

  async created() {
    try {
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await createAuth0Client({
        ...this.authOptions,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: this.authOptions.clientId,
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: this.redirectUri
      });
      // If the user is returning to the app after authentication..
      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        // handle the redirect and retrieve tokens
        await this.auth0Client.handleRedirectCallback();
        this.error = null;
      }
    } catch (e) {
      console.log(e);
      this.error = e;
    } finally {
      // Initialize our internal authentication state
      this.isAuthenticated =
        (await this.auth0Client?.isAuthenticated()) ?? false;
      this.user = (await this.auth0Client?.getUser()) ?? {};
      this.loading = false;
      this.notifyAuthListeners();
    }
  }

  private notifyAuthListeners(ctx: "load" | "popup" = "load") {
    Object.values(this.onRedirectCallback).forEach(fn =>
      fn(this.isAuthenticated, ctx)
    );
  }

  /** Authenticates the user using a popup window */
  async loginWithPopup(
    options?: PopupLoginOptions,
    config?: PopupConfigOptions
  ) {
    this.popupOpen = true;

    try {
      await this.auth0Client?.loginWithPopup(options, config);
      this.user = (await this.auth0Client?.getUser()) ?? {};
      this.isAuthenticated =
        (await this.auth0Client?.isAuthenticated()) ?? false;
      this.error = null;
    } catch (e) {
      this.error = e;
      console.error(e);
    } finally {
      this.popupOpen = false;
    }

    this.user = (await this.auth0Client?.getUser()) ?? {};
    this.isAuthenticated = true;
    this.notifyAuthListeners("popup");
  }

  /** Handles the callback when logging in using a redirect */
  async handleRedirectCallback() {
    this.loading = true;
    try {
      await this.auth0Client?.handleRedirectCallback();
      this.user = (await this.auth0Client?.getUser()) ?? {};
      this.isAuthenticated = true;
      this.error = null;
    } catch (e) {
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  /** Authenticates the user using the redirect method */
  loginWithRedirect(o?: RedirectLoginOptions) {
    return this.auth0Client?.loginWithRedirect(o);
  }

  /** Returns all the claims present in the ID token */
  getIdTokenClaims(o?: GetIdTokenClaimsOptions) {
    return this.auth0Client?.getIdTokenClaims(o);
  }

  /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
  getTokenSilently(o?: GetTokenSilentlyOptions) {
    return this.auth0Client?.getTokenSilently(o);
  }

  /** Gets the access token using a popup window */
  async getTokenWithPopup(o?: GetTokenWithPopupOptions) {
    return this.auth0Client?.getTokenWithPopup(o);
  }
  /** Logs the user out and removes their session on the authorization server */
  logout(o?: LogoutOptions) {
    return this.auth0Client?.logout(o);
  }
}

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = new OAuth({
    propsData: {
      redirectUri,
      authOptions: options
    }
  });

  return instance;
};

declare module "vue/types/vue" {
  interface Vue {
    $oauth: OAuth;
  }
}

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin: PluginObject<Auth0ClientOptions> = {
  install(Vue, options?: Auth0ClientOptions) {
    Vue.prototype.$oauth = useAuth0({ ...options });
  }
};
