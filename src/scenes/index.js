import DaltonScene from './dalton/DaltonScene.jsx'
import { daltonSteps } from '../data/scenes/dalton.js'

// Cenas prontas. Um item da roda que não estiver aqui abre a tela provisória.
// Para adicionar uma cena nova: criar a pasta da cena, os textos em src/data/scenes/
// e registrar aqui.
export const sceneRegistry = {
  dalton: { Component: DaltonScene, steps: daltonSteps },
}
