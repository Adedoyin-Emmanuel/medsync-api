import CreateSquadClient from "@squadco/js";

const squad = new CreateSquadClient(
  process.env.NEXT_SQUAD_PUBLIC_KEY as string,
  process.env.NEXT_SQUAD_PRIVATE_KEY as string,
  "development"
);

export default squad;
