import React from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import { useMachine, useSelector } from "@xstate/react";
import { AppRegistrationOutlined, CodeOutlined } from "@mui/icons-material";
import { useAppLogger } from "../logger";
import { loginMachine } from "../machines/loginMachine";
import Paper from "./styled/Paper";
import Avatar from "./styled/Avatar";
import Form from "./styled/Form";
import { ButtonGroup } from "@mui/material";
import PopperToggle from "./styled/PoperText";
 
import { Link } from "react-router-dom";
import { gigyaLoginApiServices } from "../gigya/services";
import { ServicesProps } from "../ioc/services";

export interface SignUpProps extends ServicesProps {
}

const loginServiceSelector = (state: any) => state.context;
export default function SignUp({
  authService,
  notificationsService,
}: SignUpProps) {

  const [state, send, service] = useMachine(() =>
    loginMachine('register').withConfig({
      services: gigyaLoginApiServices 
    })
  );
  const loading = state.matches("loading");

  useAppLogger(service, notificationsService.send);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm();
  const params = watch();

  // const [ state,sendAuth] = useActor(authService.state);
  // The normal Gigya account login process makes use of
  // the react-hook-form library

  const handleRegister = async (data: any) => {
    const params = {
      email: data.email,
      password: data.password,
    };
    service.send({ type: "SIGNUP", ...params });
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Paper>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Form noValidate onSubmit={handleSubmit(handleRegister)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register("email", { required: true })}
          />
          {errors && errors.email && <span>Please enter an Email address</span>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
          />
          {errors && errors.password && <span>Please enter a password</span>}

          <ButtonGroup
            variant="outlined"
            color="secondary"
            aria-label="outlined secondary button group"
          >
            <Button
              startIcon={<AppRegistrationOutlined />}
              variant="outlined"
              type="submit"
              color="secondary"
              disabled={loading}
            >
              Sign Up
            </Button>
            <PopperToggle
              toggle={{
                startIcon: <CodeOutlined />,
                variant: "text",
                color: "secondary",
              }}
            >
              <p>
                {`
            gigya.accounts.register(
                 ${JSON.stringify(params, null, 20)}
            )
            `}
              </p>
            </PopperToggle>
          </ButtonGroup>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
          
        </Form>
        <Grid container justifyContent="flex-end">
          <Grid item> 
            <Link to="signin" >
              {"Already have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
