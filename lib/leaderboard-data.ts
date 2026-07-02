export type Crest =
  | 'grape'
  | 'glass'
  | 'barrel'
  | 'music'
  | 'leaf'
  | 'corkscrew'
  | 'wine'

export type Team = {
  id: string
  rank: number
  name: string
  coach: string
  points: number
  crest: Crest
  crestColor: string
  isUser?: boolean
}

export type Player = {
  id: string
  rank: number
  name: string
  points: number
  isUser?: boolean
}

export const teams: Team[] = [
  { id: 't1', rank: 1, name: 'I Ghiottoni', coach: 'Marco', points: 520, crest: 'grape', crestColor: '#7d1f2d' },
  { id: 't2', rank: 2, name: 'I Bicchieri', coach: 'Luca', points: 480, crest: 'glass', crestColor: '#1d2f57' },
  { id: 't3', rank: 3, name: 'I Brindisi', coach: 'Sara', points: 450, crest: 'grape', crestColor: '#2f5133' },
  { id: 't4', rank: 4, name: 'I Golosi', coach: 'Paolo', points: 420, crest: 'barrel', crestColor: '#5b3a86' },
  { id: 't5', rank: 5, name: 'I Festaioli', coach: 'Giulia', points: 390, crest: 'music', crestColor: '#7d1f2d' },
  { id: 't6', rank: 6, name: 'I Configni', coach: 'Bomba', points: 370, crest: 'grape', crestColor: '#5e1420', isUser: true },
  { id: 't7', rank: 7, name: 'I Vignaioli', coach: 'Davide', points: 340, crest: 'leaf', crestColor: '#2f5133' },
  { id: 't8', rank: 8, name: 'Gli Stappatori', coach: 'Antonio', points: 310, crest: 'music', crestColor: '#1d2f57' },
  { id: 't9', rank: 9, name: 'I Sorsi Felici', coach: 'Chiara', points: 280, crest: 'corkscrew', crestColor: '#5a3a24' },
  { id: 't10', rank: 10, name: 'Le Leggende', coach: 'Matteo', points: 250, crest: 'wine', crestColor: '#1c5a56' },
]

export const players: Player[] = [
  { id: 'p1', rank: 1, name: 'Marco Rossi', points: 210 },
  { id: 'p2', rank: 2, name: 'Luca Bianchi', points: 198 },
  { id: 'p3', rank: 3, name: 'Sara Verdi', points: 187 },
  { id: 'p4', rank: 4, name: 'Paolo Neri', points: 172 },
  { id: 'p5', rank: 5, name: 'Giulia Conti', points: 165 },
  { id: 'p6', rank: 6, name: 'Bomba', points: 158, isUser: true },
  { id: 'p7', rank: 7, name: 'Davide Ferri', points: 149 },
  { id: 'p8', rank: 8, name: 'Antonio Gallo', points: 141 },
  { id: 'p9', rank: 9, name: 'Chiara Marino', points: 133 },
  { id: 'p10', rank: 10, name: 'Matteo Costa', points: 126 },
]
