import { doLogout } from "@/app/actions";
import { Button } from "./button";

const Logout = () => {
  return (
    <form action={doLogout}>
      <Button color="red" type="submit" name="action" value="logout">
        logout
      </Button>
    </form>
  );
};

export default Logout;
