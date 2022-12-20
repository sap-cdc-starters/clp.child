import {   SmartToyOutlined} from "@mui/icons-material";
import { useActor } from "@xstate/react";
import { AnyInterpreter, AnyState } from "xstate";
import InputIcon from "./styled/InputIcon";
function getState(state: AnyState) {
  return state.toStrings().reverse()[0];
  /*  let current= state;
  while(state.toStrings(state.value, ',')){
      for ()
  }*/
}

export const AppState = ({ service }: { service: AnyInterpreter }) => {
  const [state] = useActor(service);

  return (
    <InputIcon.Container>
      <InputIcon.Icon>
        <SmartToyOutlined />
      </InputIcon.Icon>
      <InputIcon.Input placeholder="..." value={getState(state)} />
    </InputIcon.Container>
  );
};
