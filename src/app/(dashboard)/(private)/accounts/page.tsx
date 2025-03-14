'use client'

import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'

import { format } from 'date-fns'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

import { useAccounts } from '@/hooks/useAccounts'

const AccountsPage = () => {
  const { accounts, loading, error } = useAccounts()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAccounts = accounts.filter(account => {
    const searchLower = searchTerm.toLowerCase()

    return (
      account.firstname.toLowerCase().includes(searchLower) ||
      account.surname.toLowerCase().includes(searchLower) ||
      account.email.toLowerCase().includes(searchLower) ||
      account.phone.includes(searchTerm) ||
      account.user_id.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        Accounts
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search accounts...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position='end'>
                <IconButton size='small' onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map(account => (
              <TableRow key={account.user_id}>
                <TableCell>{account.user_id}</TableCell>
                <TableCell>{`${account.firstname} ${account.surname}`}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.phone}</TableCell>
                <TableCell>₦{account.balance.toLocaleString()}</TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell>
                  <Box
                    component='span'
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: account.status === 1 ? 'success.light' : 'error.light',
                      color: account.status === 1 ? 'success.dark' : 'error.dark'
                    }}
                  >
                    {account.status === 1 ? 'Active' : 'Inactive'}
                  </Box>
                </TableCell>
                <TableCell>{format(account.created_at, 'MMM dd, yyyy HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AccountsPage
