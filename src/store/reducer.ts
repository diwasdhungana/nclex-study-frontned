export const provider = (
  state = { subject: null, user: {} },
  action: { payload: any; type: string }
) => {
  switch (action.type) {
    case 'SET_SUBJECT':
      return { ...state, subject: action.payload };
    case 'USER_LOADED':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
