import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const round = game.addRound({
    name: "Chat",
    task: "Chat",
  });
  round.addStage({ name: "Chat -- phase 1", duration: 1000 });
  round.addStage({ name: "Chat -- phase 2", duration: 1000 });
  round.addStage({ name: "Chat -- phase 3", duration: 100000 });
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
