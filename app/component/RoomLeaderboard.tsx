'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface RoomLeaderboardProps {
  members: Array<{
    user: {
      username: string
      Ranking: Array<{
        score: number
      }>
    }
  }>
}

export function RoomLeaderboard({ members }: RoomLeaderboardProps) {
  // Sort members by their highest score
  const sortedMembers = [...members].sort((a, b) => {
    const scoreA = Math.max(...a.user.Ranking.map((r) => r.score || 0))
    const scoreB = Math.max(...b.user.Ranking.map((r) => r.score || 0))
    return scoreB - scoreA
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Best Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMembers.map((member, index) => (
          <TableRow className='text-white' key={member.user.username}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{member.user.username}</TableCell>
            <TableCell>
              {Math.max(...member.user.Ranking.map((r) => r.score || 0))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

