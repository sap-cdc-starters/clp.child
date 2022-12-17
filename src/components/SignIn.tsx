import React from "react";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useMachine, useSelector } from "@xstate/react";
import {
    CodeOutlined,
  ErrorOutlined,
  Google,
  JavascriptOutlined,
  JavascriptRounded,
  Label,
  LoginOutlined,
  SafetyDividerOutlined,
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
import { loginMachine, LoginSuccessPayload } from "../machines/loginMachine";
import { gigyaLoginApiServices } from "../gigya/services";
import { useAppLogger } from "../logger";
import { ServicesProps } from "../pages";
import Paper from "./styled/Paper";
import Avatar from "./styled/Avatar";
import Form from "./styled/Form";
import PopperToggle from "./styled/PoperText";

export interface SignInProps extends ServicesProps {}

export default function SignIn({
  notificationsService,
}: ServicesProps) {
  const nevigate = useNavigate();
  const [state, send, service] = useMachine(() =>
    loginMachine('login').withConfig({
      services: gigyaLoginApiServices,
      actions: {
        onSuccessEntry: (ctx, { token, user }: LoginSuccessPayload) => {
          nevigate("/profile");
        },
      },
    })
  );
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
      redirectURL: `${window.location.origin}/profile`,
    },
  });
  const loading = state.matches("loading");
  const loginParams = watch();

  const handleSSo = async (data: any) => {
    loginService.send({ type: "SSO", ...data });
  };

  const handleGoogleLogin = () => {
    loginService.send({ type: "SOCIAL", provider: "google" });
  };

  return (
    <Paper>
      <Avatar sx={{ backgroundColor: "secondary.main" }} color="secondary">
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in with SSO
      </Typography>

      <Form onSubmit={handleSubmit(handleSSo)}>
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
          aria-label="outlined secondary button group"
        >
          <Button
            startIcon={<LoginOutlined />}
            variant="outlined"
            type="submit"
            color="secondary"
            disabled={loading}
          >
            Login
          </Button>
          <PopperToggle toggle={{
                        startIcon:<CodeOutlined />,
                        variant:"text",
                        color:"secondary"            
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
