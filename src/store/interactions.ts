// export const setSubjectContext = async (provider, subject, dispatch) => {
//   dispatch({ type: 'SET_SUBJECT', payload: subject });
//   return;
// };
// export const clearSubjectContext = async (provider, subject, dispatch) => {
//   dispatch({ type: 'SET_SUBJECT', payload: subject });
//   return;
// };

export const loadUserid = async (
  user: {},
  dispatch: ({ type, payload }: { type: string; payload: any }) => {}
) => {
  dispatch({ type: 'USER_LOADED', payload: user });
  return;
};
