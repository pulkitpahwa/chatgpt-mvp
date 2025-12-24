import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MatchState {
  why_copy: string;
  message_copy: string;
  nextsteps_copy: string;
  gpt_context_id: string;
  match_status: "pending" | "matched" | "not_matched" | "error" | null;
}

const initialState: MatchState = {
  why_copy: "",
  message_copy: "",
  nextsteps_copy: "",
  gpt_context_id: "",
  match_status: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setWhyCopy: (state, action: PayloadAction<string>) => {
      state.why_copy = action.payload;
    },
    setMessageCopy: (state, action: PayloadAction<string>) => {
      state.message_copy = action.payload;
    },
    setNextStepsCopy: (state, action: PayloadAction<string>) => {
      state.nextsteps_copy = action.payload;
    },
    setGptContextId: (state, action: PayloadAction<string>) => {
      state.gpt_context_id = action.payload;
    },
    setMatchStatus: (
      state,
      action: PayloadAction<MatchState["match_status"]>
    ) => {
      state.match_status = action.payload;
    },
    setMatchData: (state, action: PayloadAction<Partial<MatchState>>) => {
      return { ...state, ...action.payload };
    },
    resetMatch: () => initialState,
  },
});

export const {
  setWhyCopy,
  setMessageCopy,
  setNextStepsCopy,
  setGptContextId,
  setMatchStatus,
  setMatchData,
  resetMatch,
} = matchSlice.actions;

export default matchSlice.reducer;
