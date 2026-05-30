import { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Alert, CircularProgress, InputAdornment, Autocomplete, useTheme } from '@mui/material';
import { Plus, Trash2, Search, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import api from '../api/axiosConfig';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ marginTop: 24 }}>
      {value === index && children}
    </div>
  );
}

export default function AdminPanel() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogError, setDialogError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const [openMovie, setOpenMovie] = useState(false);
  const [openEditMovie, setOpenEditMovie] = useState(false);
  const [openHall, setOpenHall] = useState(false);
  const [openSession, setOpenSession] = useState(false);

  const [newMovie, setNewMovie] = useState({ title: '', description: '', genre: '', duration: '', ageRating: '' });
  const [editingMovie, setEditingMovie] = useState({ id: '', title: '', description: '', genre: '', duration: '', ageRating: '' });
  const [newHall, setNewHall] = useState({ name: '', rows: '', seatsPerRow: '' });
  const [newSession, setNewSession] = useState({ startTime: '', price: '' });

  const [moviesList, setMoviesList] = useState([]);
  const [hallsList, setHallsList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 0) {
        const res = await api.get('/admin/movies');
        setMovies(res.data);
      } else if (tab === 1) {
        const res = await api.get('/admin/halls');
        setHalls(res.data);
      } else if (tab === 2) {
        const res = await api.get('/admin/sessions');
        setSessions(res.data);
      } else if (tab === 3) {
        const res = await api.get('/admin/bookings');
        setBookings(res.data);
      }
    } catch (err) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery('');
    fetchData();
  }, [tab]);

  useEffect(() => {
    if (openSession) {
      api.get('/admin/movies').then(res => setMoviesList(res.data)).catch(() => {});
      api.get('/admin/halls').then(res => setHallsList(res.data)).catch(() => {});
    }
  }, [openSession]);

  const handleDelete = async (endpoint, id, setter, data) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      setter(data.filter(item => item.id !== id));
    } catch (err) {
      setError('Ошибка удаления');
    }
  };

  const handleOpenMovie = () => { setDialogError(''); setOpenMovie(true); };
  const handleOpenHall = () => { setDialogError(''); setOpenHall(true); };
  const handleOpenSession = () => { setDialogError(''); setSelectedMovie(null); setSelectedHall(null); setNewSession({ startTime: '', price: '' }); setOpenSession(true); };

  const handleOpenEditMovie = (movie) => {
    setDialogError('');
    setEditingMovie({
      id: movie.id,
      title: movie.title || '',
      description: movie.description || '',
      genre: movie.genre || '',
      duration: movie.duration || '',
      ageRating: movie.ageRating || ''
    });
    setOpenEditMovie(true);
  };

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.description || !newMovie.genre || !newMovie.duration || !newMovie.ageRating) {
      setDialogError('Пожалуйста, заполните все поля');
      return;
    }
    try {
      await api.post('/admin/movies', { ...newMovie, duration: parseInt(newMovie.duration) });
      setOpenMovie(false);
      fetchData();
    } catch (err) { setDialogError('Ошибка добавления фильма'); }
  };

  const handleEditMovie = async () => {
    if (!editingMovie.title || !editingMovie.description || !editingMovie.genre || !editingMovie.duration || !editingMovie.ageRating) {
      setDialogError('Пожалуйста, заполните все поля');
      return;
    }
    try {
      await api.put(`/admin/movies/${editingMovie.id}`, {
        title: editingMovie.title,
        description: editingMovie.description,
        genre: editingMovie.genre,
        duration: parseInt(editingMovie.duration),
        ageRating: editingMovie.ageRating
      });
      setOpenEditMovie(false);
      fetchData();
    } catch (err) { setDialogError('Ошибка обновления фильма'); }
  };

  const handleAddHall = async () => {
    if (!newHall.name || !newHall.rows || !newHall.seatsPerRow) {
      setDialogError('Пожалуйста, заполните все поля');
      return;
    }
    try {
      await api.post('/admin/halls', { ...newHall, rows: parseInt(newHall.rows), seatsPerRow: parseInt(newHall.seatsPerRow) });
      setOpenHall(false);
      fetchData();
    } catch (err) { setDialogError('Ошибка добавления зала'); }
  };

  const handleAddSession = async () => {
    if (!selectedMovie || !selectedHall || !newSession.startTime || !newSession.price) {
      setDialogError('Пожалуйста, заполните все поля');
      return;
    }
    try {
      await api.post('/admin/sessions', { 
        movieId: selectedMovie.id, 
        hallId: selectedHall.id, 
        startTime: newSession.startTime, 
        price: parseFloat(newSession.price) 
      });
      setOpenSession(false);
      fetchData();
    } catch (err) { setDialogError('Ошибка добавления сеанса'); }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getNestedValue = (obj, key) => key.split('.').reduce((o, k) => (o || {})[k], obj);

  const processDatas = (data) => {
    const query = searchQuery.toLowerCase();
    let filtered = data;

    if (query) {
      filtered = data.filter(item => {
        if (tab === 0) return item.title?.toLowerCase().includes(query) || item.genre?.toLowerCase().includes(query);
        if (tab === 1) return item.name?.toLowerCase().includes(query);
        if (tab === 2) return item.movie?.title?.toLowerCase().includes(query) || item.cinemaHall?.name?.toLowerCase().includes(query);
        if (tab === 3) return item.user?.username?.toLowerCase().includes(query) || item.session?.movie?.title?.toLowerCase().includes(query) || item.status?.toLowerCase().includes(query);
        return false;
      });
    }

    return filtered.sort((a, b) => {
      const valA = getNestedValue(a, sortConfig.key) || '';
      const valB = getNestedValue(b, sortConfig.key) || '';
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const headerSx = { fontWeight: 700, color: 'text.secondary', transition: 'color 0.3s ease', cursor: 'pointer', userSelect: 'none', '&:hover': { color: 'primary.main' } };
  const cellSx = { color: 'text.primary', transition: 'color 0.3s ease' };
  const paperSx = { bgcolor: 'background.paper', transition: 'background-color 0.3s ease', border: '1px solid', borderColor: 'divider' };
  const noAsteriskSx = { '& .MuiInputLabel-asterisk': { display: 'none' } };

  const SortableHeader = ({ label, sortKey }) => (
    <TableCell sx={headerSx} onClick={() => handleSort(sortKey)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {label}
        {sortConfig.key === sortKey && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
      </Box>
    </TableCell>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 3, transition: 'color 0.3s ease' }}>
          Управление кинотеатром
        </Typography>

        <Tabs 
          value={tab} 
          onChange={(e, newVal) => setTab(newVal)}
          sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            mb: 2,
            '& .MuiTab-root': { color: 'text.secondary', transition: 'color 0.3s ease' },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' }
          }}
        >
          <Tab label="Фильмы" />
          <Tab label="Залы" />
          <Tab label="Сеансы" />
          <Tab label="Бронирования" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2, transition: 'background-color 0.3s ease, color 0.3s ease' }}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <TextField
            size="small"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ 
              width: 360,
              bgcolor: 'background.paper', 
              borderRadius: '8px', 
              transition: 'background-color 0.3s ease',
              '& .MuiOutlinedInput-root': { borderRadius: '8px', transition: 'background-color 0.3s ease, border-color 0.3s ease' },
              '& .MuiOutlinedInput-input': { bgcolor: 'transparent !important' },
            }}
          />
          {tab === 0 && <Button variant="contained" startIcon={<Plus size={20} />} onClick={handleOpenMovie}>Добавить фильм</Button>}
          {tab === 1 && <Button variant="contained" startIcon={<Plus size={20} />} onClick={handleOpenHall}>Добавить зал</Button>}
          {tab === 2 && <Button variant="contained" startIcon={<Plus size={20} />} onClick={handleOpenSession}>Добавить сеанс</Button>}
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TabPanel value={tab} index={0}>
              <TableContainer component={Paper} sx={paperSx}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <SortableHeader label="ID" sortKey="id" />
                      <SortableHeader label="Название" sortKey="title" />
                      <SortableHeader label="Жанр" sortKey="genre" />
                      <SortableHeader label="Длительность" sortKey="duration" />
                      <SortableHeader label="Рейтинг" sortKey="ageRating" />
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }} align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processDatas(movies).map((movie) => (
                      <TableRow key={movie.id} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={cellSx}>{movie.id}</TableCell>
                        <TableCell sx={cellSx}>{movie.title}</TableCell>
                        <TableCell sx={cellSx}>{movie.genre}</TableCell>
                        <TableCell sx={cellSx}>{movie.duration} мин.</TableCell>
                        <TableCell sx={cellSx}>{movie.ageRating}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton color="primary" onClick={() => handleOpenEditMovie(movie)}><Pencil size={20} /></IconButton>
                            <IconButton color="error" onClick={() => handleDelete('admin/movies', movie.id, setMovies, movies)}><Trash2 size={20} /></IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <TableContainer component={Paper} sx={paperSx}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <SortableHeader label="ID" sortKey="id" />
                      <SortableHeader label="Название" sortKey="name" />
                      <SortableHeader label="Всего мест" sortKey="totalSeats" />
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }} align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processDatas(halls).map((hall) => (
                      <TableRow key={hall.id} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={cellSx}>{hall.id}</TableCell>
                        <TableCell sx={cellSx}>{hall.name}</TableCell>
                        <TableCell sx={cellSx}>{hall.totalSeats || '—'}</TableCell>
                        <TableCell align="right">
                          <IconButton color="error" onClick={() => handleDelete('admin/halls', hall.id, setHalls, halls)}><Trash2 size={20} /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <TableContainer component={Paper} sx={paperSx}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <SortableHeader label="ID" sortKey="id" />
                      <SortableHeader label="Фильм" sortKey="movie.title" />
                      <SortableHeader label="Зал" sortKey="cinemaHall.name" />
                      <SortableHeader label="Время" sortKey="startTime" />
                      <SortableHeader label="Цена" sortKey="price" />
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }} align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processDatas(sessions).map((s) => (
                      <TableRow key={s.id} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={cellSx}>{s.id}</TableCell>
                        <TableCell sx={cellSx}>{s.movie?.title || '—'}</TableCell>
                        <TableCell sx={cellSx}>{s.cinemaHall?.name || '—'}</TableCell>
                        <TableCell sx={cellSx}>{new Date(s.startTime).toLocaleString('ru-RU')}</TableCell>
                        <TableCell sx={cellSx}>{s.price} ₽</TableCell>
                        <TableCell align="right">
                          <IconButton color="error" onClick={() => handleDelete('admin/sessions', s.id, setSessions, sessions)}><Trash2 size={20} /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tab} index={3}>
              <TableContainer component={Paper} sx={paperSx}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <SortableHeader label="ID" sortKey="id" />
                      <SortableHeader label="Пользователь" sortKey="user.username" />
                      <SortableHeader label="Фильм" sortKey="session.movie.title" />
                      <SortableHeader label="Место" sortKey="seat.rowNumber" />
                      <SortableHeader label="Статус" sortKey="status" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processDatas(bookings).map((b) => (
                      <TableRow key={b.id} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={cellSx}>{b.id}</TableCell>
                        <TableCell sx={cellSx}>{b.user?.username || '—'}</TableCell>
                        <TableCell sx={cellSx}>{b.session?.movie?.title || '—'}</TableCell>
                        <TableCell sx={cellSx}>Ряд {b.seat?.rowNumber}, Место {b.seat?.seatNumber}</TableCell>
                        <TableCell sx={cellSx}>{b.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </>
        )}
      </Container>

      <Dialog open={openMovie} onClose={() => setOpenMovie(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle sx={{ color: 'text.primary', transition: 'color 0.3s ease' }}>Добавить фильм</DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="warning" sx={{ mb: 2 }}>{dialogError}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Название" fullWidth value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Описание" fullWidth multiline rows={3} value={newMovie.description} onChange={(e) => setNewMovie({...newMovie, description: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Жанр" fullWidth value={newMovie.genre} onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Длительность (мин)" type="number" fullWidth value={newMovie.duration} onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Возрастной рейтинг" fullWidth value={newMovie.ageRating} onChange={(e) => setNewMovie({...newMovie, ageRating: e.target.value})} sx={noAsteriskSx} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMovie(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleAddMovie}>Добавить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditMovie} onClose={() => setOpenEditMovie(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle sx={{ color: 'text.primary', transition: 'color 0.3s ease' }}>Редактировать фильм</DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="warning" sx={{ mb: 2 }}>{dialogError}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Название" fullWidth value={editingMovie.title} onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Описание" fullWidth multiline rows={3} value={editingMovie.description} onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Жанр" fullWidth value={editingMovie.genre} onChange={(e) => setEditingMovie({...editingMovie, genre: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Длительность (мин)" type="number" fullWidth value={editingMovie.duration} onChange={(e) => setEditingMovie({...editingMovie, duration: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Возрастной рейтинг" fullWidth value={editingMovie.ageRating} onChange={(e) => setEditingMovie({...editingMovie, ageRating: e.target.value})} sx={noAsteriskSx} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditMovie(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleEditMovie}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openHall} onClose={() => setOpenHall(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle sx={{ color: 'text.primary', transition: 'color 0.3s ease' }}>Добавить зал</DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="warning" sx={{ mb: 2 }}>{dialogError}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Название зала" fullWidth value={newHall.name} onChange={(e) => setNewHall({...newHall, name: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Количество рядов" type="number" fullWidth value={newHall.rows} onChange={(e) => setNewHall({...newHall, rows: e.target.value})} sx={noAsteriskSx} />
            <TextField label="Мест в ряду" type="number" fullWidth value={newHall.seatsPerRow} onChange={(e) => setNewHall({...newHall, seatsPerRow: e.target.value})} sx={noAsteriskSx} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHall(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleAddHall}>Добавить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSession} onClose={() => setOpenSession(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle sx={{ color: 'text.primary', transition: 'color 0.3s ease' }}>Добавить сеанс</DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="warning" sx={{ mb: 2 }}>{dialogError}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={moviesList}
              getOptionLabel={(option) => option.title || ''}
              value={selectedMovie}
              onChange={(e, newValue) => setSelectedMovie(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Фильм" sx={noAsteriskSx} />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              options={hallsList}
              getOptionLabel={(option) => option.name || ''}
              value={selectedHall}
              onChange={(e, newValue) => setSelectedHall(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Зал" sx={noAsteriskSx} />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <TextField
              label="Время начала"
              type="datetime-local"
              fullWidth
              value={newSession.startTime}
              onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
              slotProps={{
                inputLabel: { shrink: true },
                input: { notched: true }
              }}
              sx={{ 
                ...noAsteriskSx, 
                '& .MuiInputBase-input': { 
                  colorScheme: theme.palette.mode,
                  color: theme.palette.text.primary
                }
              }}
            />
            <TextField
              label="Цена (₽)"
              type="number"
              fullWidth
              value={newSession.price}
              onChange={(e) => setNewSession({...newSession, price: e.target.value})}
              sx={noAsteriskSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSession(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleAddSession}>Добавить</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}