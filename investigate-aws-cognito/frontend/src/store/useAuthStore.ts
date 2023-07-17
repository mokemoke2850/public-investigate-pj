import { AuthEventData } from '@aws-amplify/ui';
import { create } from 'zustand';

export type SignOutActionType =
  | ((data?: AuthEventData | undefined) => void)
  | undefined;

export interface AuthStoreState {
  userName: string;
  userGroups: string[];
  email: string;
}

interface AuthStoreAction {
  setUserAuthInformation: (value: AuthStoreState) => void;
}

const initialState: AuthStoreState = {
  userName: '',
  userGroups: [],
  email: '',
};

export const useAuthStore = create<AuthStoreState & AuthStoreAction>()(
  (set) => ({
    ...initialState,
    setUserAuthInformation: (value: AuthStoreState) =>
      set(() => ({ ...value })),
  })
);
