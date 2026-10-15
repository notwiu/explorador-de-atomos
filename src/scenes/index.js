import DaltonScene from './dalton/DaltonScene.jsx'
import ThomsonScene from './thomson/ThomsonScene.jsx'
import { daltonSteps } from '../data/scenes/dalton.js'
import { thomsonSteps } from '../data/scenes/thomson.js'

// Cenas prontas. Um item da roda que não estiver aqui abre a tela provisória.
// Para adicionar uma cena nova: criar a pasta da cena, os textos em src/data/scenes/
// e registrar aqui.
export const sceneRegistry = {
  dalton: { Component: DaltonScene, steps: daltonSteps },
  thomson: { Component: ThomsonScene, steps: thomsonSteps },
}
