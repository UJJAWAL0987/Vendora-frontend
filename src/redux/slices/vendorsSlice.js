import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Fetch all vendors (admin)
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/vendors');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch vendors');
    }
  }
);

// Approve/disapprove vendor (admin)
export const updateVendorStatus = createAsyncThunk(
  'vendors/updateVendorStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/vendors/${id}/status`, { isActive });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update vendor status');
    }
  }
);

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState: {
    vendors: [],
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vendors';
      })
      // Update vendor status
      .addCase(updateVendorStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.vendors.findIndex(v => v._id === action.payload._id);
        if (idx !== -1) state.vendors[idx] = action.payload;
      })
      .addCase(updateVendorStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || 'Failed to update vendor status';
      });
  },
});

export default vendorsSlice.reducer; 