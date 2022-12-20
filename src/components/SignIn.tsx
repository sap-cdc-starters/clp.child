import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useInterpret, useMachine, useSelector } from "@xstate/react";
import {
    CodeOutlined,
  Google,
  LoginOutlined,
} from "@mui/icons-material";
import {
  ButtonGroup,
  Checkbox,
  Fab,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
} from "@mui/material";
import { LoginMachine, loginMachine, LoginSuccessPayload } from "../machines/loginMachine";
import { gigyaLoginApiServices } from "../gigya/services";
import { useAppLogger } from "../logger";
import type { ServicesProps } from "../ioc/services";
import PopperToggle from "./styled/PoperText";

import Paper from "./styled/Paper";
import Avatar from "./styled/Avatar";
import Form from "./styled/Form";
import {StateFrom} from "xstate";

const loadingSelector=(state:StateFrom<LoginMachine> )=>state.matches("loading");
export interface SignInProps extends ServicesProps {}

export default function SignIn({
  notificationsService,
  authService
}: ServicesProps) {
  const service = useInterpret(() =>
    loginMachine('login').withConfig({
      services: gigyaLoginApiServices,
    }
    ),
    {
      actions: {
        onSuccessEntry:(ctx, event)=>{
          authService.send({ type: "LOGGED_IN", ...ctx });
        }
      }
    });

  const loading = useSelector(service, loadingSelector)
  const loginService = service;

  useAppLogger(service, notificationsService.send);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      authFlow: "redirect",
      useChildContext: false,
      redirectURL: `${window.location.origin}`,
    },
  });
  
  const loginParams = watch();

  const handleSSo = async (data: any) => {
    loginService.send({ type: "SSO", ...data });
  };

  const handleGoogleLogin = () => {
    loginService.send({ type: "SOCIAL", provider: "google" });
  };

  return (
    <Paper sx={{position:"sticky" ,  justifySelf:"center"}}>
      <Avatar sx={{  backgroundColor: "secondary.main" }} color="secondary" >
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in with SSO
      </Typography>

      <Form onSubmit={handleSubmit(handleSSo)} sx={{ justifyContent:"stretch"}}>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                aria-label={"useChildContext"}
                id="useChildContext"
                autoFocus
                {...register("useChildContext")}
              />
            }
            label="Use Child Context"
          />
          <Select
            variant="outlined"
            required
            fullWidth
            label="authFlow"
            type="authFlow"
            id="authFlow"
            defaultValue={"redirect"}
            autoComplete="authFlow"
            {...register("authFlow", { required: true })}
          >
            <MenuItem key={"redirect"} value={"redirect"}>
              {"redirect"}
            </MenuItem>
            <MenuItem key={"popup"} value={"popup"}>
              {"popup"}
            </MenuItem>
          </Select>
          {errors && errors.authFlow && <span>Please enter a authFlow</span>}
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="redirectURL"
            label="redirect URL"
            autoComplete="redirectURL"
            autoFocus
            {...register("redirectURL")}
          />
          {errors && errors.redirectURL && (
            <span>Please enter a valid redirect URL</span>
          )}
        </div>

       
        <ButtonGroup
            variant="outlined"
            color="secondary"
            aria-label="split button"
            sx={{justifySelf:"stretch", justifyContent:"stretch"}}
        >
          <Button
            startIcon={<LoginOutlined />}
            variant="outlined"
            type="submit"
            color="secondary"
            disabled={loading}
            size="medium"
          >
            Login
          </Button>
          <PopperToggle 

          toggle={{
                        startIcon:<CodeOutlined />,
                        variant:"text",
                        color:"secondary",
                        size:"small"
        
          }}>
            <p>
              {`
            gigya.sso.login(
                 ${JSON.stringify(loginParams, null, 20)}
            )
            `}
            </p>
          </PopperToggle>
        </ButtonGroup>
      </Form>

      <Fab
        sx={{ position: "fixed", left: 0 }}
        variant="extended"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <Google sx={{ mr: 1 }} />
        Login With Google
      </Fab>
    </Paper>
  );
}