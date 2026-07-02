export type Crest = 'grape' | 'glass' | 'barrel' | 'music' | 'leaf' | 'corkscrew' | 'wine'

export interface Team {
  id: string
  rank: number
  name: string
  coach: string
  points: number
  crest: Crest
  crestColor: string
  isUser?: boolean
}

export interface Player {
  id: string
  rank: number
  name: string
  points: number
  isUser?: boolean
}

export const teams: Team[] = [
  { id: '1', rank: 1, name: 'I GHIOTTONI', coach: 'Marco', points: 520, crest: 'wine', crestColor: '#8b1a2b' },
  { id: '2', rank: 2, name: 'I BICCHIERI', coach: 'Luca', points: 480, crest: 'glass', crestColor: '#2d6a4f' },
  { id: '3', rank: 3, name: 'I BRINDISI', coach: 'Sara', points: 450, crest: 'grape', crestColor: '#6b3fa0' },
  { id: '4', rank: 4, name: 'I GOLOSI', coach: 'Paolo', points: 420, crest: 'barrel', crestColor: '#8b5a2b' },
  { id: '5', rank: 5, name: 'I FESTAIOLI', coach: 'Giulia', points: 390, crest: 'music', crestColor: '#c97d1e' },
  { id: '6', rank: 6, name: 'I CONFIGNI', coach: 'Bomba', points: 370, crest: 'leaf', crestColor: '#2d6a4f', isUser: true },
  { id: '7', rank: 7, name: 'I VIGNAIOLI', coach: 'Davide', points: 340, crest: 'grape', crestColor: '#6b3fa0' },
  { id: '8', rank: 8, name: 'GLI STAPPATORI', coach: 'Antonio', points: 310, crest: 'corkscrew', crestColor: '#8b1a2b' },
  { id: '9', rank: 9, name: 'I SORSI FELICI', coach: 'Chiara', points: 280, crest: 'glass', crestColor: '#2d6a4f' },
  { id: '10', rank: 10, name: 'LE LEGGENDE', coach: 'Matteo', points: 250, crest: 'wine', crestColor: '#8b1a2b' },
]

export const players: Player[] = [
  { id: '1', rank: 1, name: 'MARCO R.', points: 320 },
  { id: '2', rank: 2, name: 'LUCA B.', points: 290 },
  { id: '3', rank: 3, name: 'SARA C.', points: 260 },
  { id: '4', rank: 4, name: 'PAOLO M.', points: 230 },
  { id: '5', rank: 5, name: 'GIULIA F.', points: 200, isUser: true },
  { id: '6', rank: 6, name: 'ALESSANDRO G.', points: 180 },
  { id: '7', rank: 7, name: 'ELENA P.', points: 150 },
  { id: '8', rank: 8, name: 'FRANCESCO T.', points: 120 },
  { id: '9', rank: 9, name: 'MARTA L.', points: 90 },
  { id: '10', rank: 10, name: 'ROBERTO S.', points: 60 },
]
