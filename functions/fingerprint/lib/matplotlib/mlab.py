"""
Numerical python functions written for compatibility with MATLAB
commands with the same names. Most numerical python functions can be found in
the `numpy` and `scipy` libraries. What remains here is code for performing
spectral computations.

Spectral functions
-------------------
`specgram`
    Spectrogram (spectrum over segments of time)
"""

import numpy as np


def window_hanning(x):
    '''
    Return x times the hanning window of len(x).

    See Also
    --------
    window_none : Another window algorithm.
    '''
    return np.hanning(len(x))*x


def apply_window(x, window, axis=0, return_window=None):
    '''
    Apply the given window to the given 1D or 2D array along the given axis.

    Parameters
    ----------
    x : 1D or 2D array or sequence
        Array or sequence containing the data.

    window : function or array.
        Either a function to generate a window or an array with length
        *x*.shape[*axis*]

    axis : integer
        The axis over which to do the repetition.
        Must be 0 or 1.  The default is 0

    return_window : bool
        If true, also return the 1D values of the window that was applied
    '''
    x = np.asarray(x)

    if x.ndim < 1 or x.ndim > 2:
        raise ValueError('only 1D or 2D arrays can be used')
    if axis+1 > x.ndim:
        raise ValueError('axis(=%s) out of bounds' % axis)

    xshape = list(x.shape)
    xshapetarg = xshape.pop(axis)

    if np.iterable(window):
        if len(window) != xshapetarg:
            raise ValueError('The len(window) must be the same as the shape '
                             'of x for the chosen axis')
        windowVals = window
    else:
        windowVals = window(np.ones(xshapetarg, dtype=x.dtype))

    if x.ndim == 1:
        if return_window:
            return windowVals * x, windowVals
        else:
            return windowVals * x

    xshapeother = xshape.pop()

    otheraxis = (axis+1) % 2

    windowValsRep = stride_repeat(windowVals, xshapeother, axis=otheraxis)

    if return_window:
        return windowValsRep * x, windowVals
    else:
        return windowValsRep * x


def detrend(x, key=None, axis=None):
    '''
    Return x with its trend removed.

    Parameters
    ----------
    x : array or sequence
        Array or sequence containing the data.

    key : [ 'default' | 'constant' | 'mean' | 'linear' | 'none'] or function
        Specifies the detrend algorithm to use. 'default' is 'mean', which is
        the same as `detrend_mean`. 'constant' is the same. 'linear' is
        the same as `detrend_linear`. 'none' is the same as
        `detrend_none`. The default is 'mean'. See the corresponding
        functions for more details regarding the algorithms. Can also be a
        function that carries out the detrend operation.

    axis : integer
        The axis along which to do the detrending.

    See Also
    --------
    detrend_mean : Implementation of the 'mean' algorithm.
    detrend_linear : Implementation of the 'linear' algorithm.
    detrend_none : Implementation of the 'none' algorithm.
    '''
    if key is None or key in ['constant', 'mean', 'default']:
        return detrend(x, key=detrend_mean, axis=axis)
    elif key == 'linear':
        return detrend(x, key=detrend_linear, axis=axis)
    elif key == 'none':
        return detrend(x, key=detrend_none, axis=axis)
    elif isinstance(key, str):
        raise ValueError("Unknown value for key %s, must be one of: "
                         "'default', 'constant', 'mean', "
                         "'linear', or a function" % key)

    if not callable(key):
        raise ValueError("Unknown value for key %s, must be one of: "
                         "'default', 'constant', 'mean', "
                         "'linear', or a function" % key)

    x = np.asarray(x)

    if axis is not None and axis+1 > x.ndim:
        raise ValueError('axis(=%s) out of bounds' % axis)

    if (axis is None and x.ndim == 0) or (not axis and x.ndim == 1):
        return key(x)

    # try to use the 'axis' argument if the function supports it,
    # otherwise use apply_along_axis to do it
    try:
        return key(x, axis=axis)
    except TypeError:
        return np.apply_along_axis(key, axis=axis, arr=x)


def detrend_mean(x, axis=None):
    '''
    Return x minus the mean(x).

    Parameters
    ----------
    x : array or sequence
        Array or sequence containing the data
        Can have any dimensionality

    axis : integer
        The axis along which to take the mean.  See numpy.mean for a
        description of this argument.

    See Also
    --------
    detrend_linear : Another detrend algorithm.
    detrend_none : Another detrend algorithm.
    detrend : A wrapper around all the detrend algorithms.
    '''
    x = np.asarray(x)

    if axis is not None and axis+1 > x.ndim:
        raise ValueError('axis(=%s) out of bounds' % axis)

    return x - x.mean(axis, keepdims=True)


def detrend_none(x, axis=None):
    '''
    Return x: no detrending.

    Parameters
    ----------
    x : any object
        An object containing the data

    axis : integer
        This parameter is ignored.
        It is included for compatibility with detrend_mean

    See Also
    --------
    detrend_mean : Another detrend algorithm.
    detrend_linear : Another detrend algorithm.
    detrend : A wrapper around all the detrend algorithms.
    '''
    return x


def detrend_linear(y):
    '''
    Return x minus best fit line; 'linear' detrending.

    Parameters
    ----------
    y : 0-D or 1-D array or sequence
        Array or sequence containing the data

    axis : integer
        The axis along which to take the mean.  See numpy.mean for a
        description of this argument.

    See Also
    --------
    detrend_mean : Another detrend algorithm.
    detrend_none : Another detrend algorithm.
    detrend : A wrapper around all the detrend algorithms.
    '''
    # This is faster than an algorithm based on linalg.lstsq.
    y = np.asarray(y)

    if y.ndim > 1:
        raise ValueError('y cannot have ndim > 1')

    # short-circuit 0-D array.
    if not y.ndim:
        return np.array(0., dtype=y.dtype)

    x = np.arange(y.size, dtype=float)

    C = np.cov(x, y, bias=1)
    b = C[0, 1]/C[0, 0]

    a = y.mean() - b*x.mean()
    return y - (b*x + a)


def stride_windows(x, n, noverlap=None, axis=0):
    '''
    Get all windows of x with length n as a single array,
    using strides to avoid data duplication.

    .. warning::

        It is not safe to write to the output array.  Multiple
        elements may point to the same piece of memory,
        so modifying one value may change others.

    Parameters
    ----------
    x : 1D array or sequence
        Array or sequence containing the data.

    n : integer
        The number of data points in each window.

    noverlap : integer
        The overlap between adjacent windows.
        Default is 0 (no overlap)

    axis : integer
        The axis along which the windows will run.

    References
    ----------
    `stackoverflow: Rolling window for 1D arrays in Numpy?
    <http://stackoverflow.com/a/6811241>`_
    `stackoverflow: Using strides for an efficient moving average filter
    <http://stackoverflow.com/a/4947453>`_
    '''
    if noverlap is None:
        noverlap = 0

    if noverlap >= n:
        raise ValueError('noverlap must be less than n')
    if n < 1:
        raise ValueError('n cannot be less than 1')

    x = np.asarray(x)

    if x.ndim != 1:
        raise ValueError('only 1-dimensional arrays can be used')
    if n == 1 and noverlap == 0:
        if axis == 0:
            return x[np.newaxis]
        else:
            return x[np.newaxis].transpose()
    if n > x.size:
        raise ValueError('n cannot be greater than the length of x')

    # np.lib.stride_tricks.as_strided easily leads to memory corruption for
    # non integer shape and strides, i.e. noverlap or n. See #3845.
    noverlap = int(noverlap)
    n = int(n)

    step = n - noverlap
    if axis == 0:
        shape = (n, (x.shape[-1]-noverlap)//step)
        strides = (x.strides[0], step*x.strides[0])
    else:
        shape = ((x.shape[-1]-noverlap)//step, n)
        strides = (step*x.strides[0], x.strides[0])
    return np.lib.stride_tricks.as_strided(x, shape=shape, strides=strides)


def stride_repeat(x, n, axis=0):
    '''
    Repeat the values in an array in a memory-efficient manner.  Array x is
    stacked vertically n times.

    .. warning::

        It is not safe to write to the output array.  Multiple
        elements may point to the same piece of memory, so
        modifying one value may change others.

    Parameters
    ----------
    x : 1D array or sequence
        Array or sequence containing the data.

    n : integer
        The number of time to repeat the array.

    axis : integer
        The axis along which the data will run.

    References
    ----------
    `stackoverflow: Repeat NumPy array without replicating data?
    <http://stackoverflow.com/a/5568169>`_
    '''
    if axis not in [0, 1]:
        raise ValueError('axis must be 0 or 1')
    x = np.asarray(x)
    if x.ndim != 1:
        raise ValueError('only 1-dimensional arrays can be used')

    if n == 1:
        if axis == 0:
            return np.atleast_2d(x)
        else:
            return np.atleast_2d(x).T
    if n < 1:
        raise ValueError('n cannot be less than 1')

    # np.lib.stride_tricks.as_strided easily leads to memory corruption for
    # non integer shape and strides, i.e. n. See #3845.
    n = int(n)

    if axis == 0:
        shape = (n, x.size)
        strides = (0, x.strides[0])
    else:
        shape = (x.size, n)
        strides = (x.strides[0], 0)

    return np.lib.stride_tricks.as_strided(x, shape=shape, strides=strides)


def _spectral_helper(x, y=None, NFFT=None, Fs=None, detrend_func=None,
                     window=None, noverlap=None, pad_to=None,
                     sides=None, scale_by_freq=None, mode=None):
    '''
    This is a helper function that implements the commonality between the
    psd, csd, spectrogram and complex, magnitude, angle, and phase spectrums.
    It is *NOT* meant to be used outside of mlab and may change at any time.
    '''
    if y is None:
        # if y is None use x for y
        same_data = True
    else:
        # The checks for if y is x are so that we can use the same function to
        # implement the core of psd(), csd(), and spectrogram() without doing
        # extra calculations.  We return the unaveraged Pxy, freqs, and t.
        same_data = y is x

    if Fs is None:
        Fs = 2
    if noverlap is None:
        noverlap = 0
    if detrend_func is None:
        detrend_func = detrend_none
    if window is None:
        window = window_hanning

    # if NFFT is set to None use the whole signal
    if NFFT is None:
        NFFT = 256

    if mode is None or mode == 'default':
        mode = 'psd'
    elif mode not in ['psd', 'complex', 'magnitude', 'angle', 'phase']:
        raise ValueError("Unknown value for mode %s, must be one of: "
                         "'default', 'psd', 'complex', "
                         "'magnitude', 'angle', 'phase'" % mode)

    if not same_data and mode != 'psd':
        raise ValueError("x and y must be equal if mode is not 'psd'")

    # Make sure we're dealing with a numpy array. If y and x were the same
    # object to start with, keep them that way
    x = np.asarray(x)
    if not same_data:
        y = np.asarray(y)

    if sides is None or sides == 'default':
        if np.iscomplexobj(x):
            sides = 'twosided'
        else:
            sides = 'onesided'
    elif sides not in ['onesided', 'twosided']:
        raise ValueError("Unknown value for sides %s, must be one of: "
                         "'default', 'onesided', or 'twosided'" % sides)

    # zero pad x and y up to NFFT if they are shorter than NFFT
    if len(x) < NFFT:
        n = len(x)
        x = np.resize(x, NFFT)
        x[n:] = 0

    if not same_data and len(y) < NFFT:
        n = len(y)
        y = np.resize(y, NFFT)
        y[n:] = 0

    if pad_to is None:
        pad_to = NFFT

    if mode != 'psd':
        scale_by_freq = False
    elif scale_by_freq is None:
        scale_by_freq = True

    # For real x, ignore the negative frequencies unless told otherwise
    if sides == 'twosided':
        numFreqs = pad_to
        if pad_to % 2:
            freqcenter = (pad_to - 1)//2 + 1
        else:
            freqcenter = pad_to//2
        scaling_factor = 1.
    elif sides == 'onesided':
        if pad_to % 2:
            numFreqs = (pad_to + 1)//2
        else:
            numFreqs = pad_to//2 + 1
        scaling_factor = 2.

    result = stride_windows(x, NFFT, noverlap, axis=0)
    result = detrend(result, detrend_func, axis=0)
    result, windowVals = apply_window(result, window, axis=0,
                                      return_window=True)
    result = np.fft.fft(result, n=pad_to, axis=0)[:numFreqs, :]
    freqs = np.fft.fftfreq(pad_to, 1/Fs)[:numFreqs]

    if not same_data:
        # if same_data is False, mode must be 'psd'
        resultY = stride_windows(y, NFFT, noverlap)
        resultY = detrend(resultY, detrend_func, axis=0)
        resultY = apply_window(resultY, window, axis=0)
        resultY = np.fft.fft(resultY, n=pad_to, axis=0)[:numFreqs, :]
        result = np.conj(result) * resultY
    elif mode == 'psd':
        result = np.conj(result) * result
    elif mode == 'magnitude':
        result = np.abs(result) / np.abs(windowVals).sum()
    elif mode == 'angle' or mode == 'phase':
        # we unwrap the phase later to handle the onesided vs. twosided case
        result = np.angle(result)
    elif mode == 'complex':
        result /= np.abs(windowVals).sum()

    if mode == 'psd':

        # Also include scaling factors for one-sided densities and dividing by
        # the sampling frequency, if desired. Scale everything, except the DC
        # component and the NFFT/2 component:

        # if we have a even number of frequencies, don't scale NFFT/2
        if not NFFT % 2:
            slc = slice(1, -1, None)
        # if we have an odd number, just don't scale DC
        else:
            slc = slice(1, None, None)

        result[slc] *= scaling_factor

        # MATLAB divides by the sampling frequency so that density function
        # has units of dB/Hz and can be integrated by the plotted frequency
        # values. Perform the same scaling here.
        if scale_by_freq:
            result /= Fs
            # Scale the spectrum by the norm of the window to compensate for
            # windowing loss; see Bendat & Piersol Sec 11.5.2.
            result /= (np.abs(windowVals)**2).sum()
        else:
            # In this case, preserve power in the segment, not amplitude
            result /= np.abs(windowVals).sum()**2

    t = np.arange(NFFT/2, len(x) - NFFT/2 + 1, NFFT - noverlap)/Fs

    if sides == 'twosided':
        # center the frequency range at zero
        freqs = np.concatenate((freqs[freqcenter:], freqs[:freqcenter]))
        result = np.concatenate((result[freqcenter:, :],
                                 result[:freqcenter, :]), 0)
    elif not pad_to % 2:
        # get the last value correctly, it is negative otherwise
        freqs[-1] *= -1

    # we unwrap the phase here to handle the onesided vs. twosided case
    if mode == 'phase':
        result = np.unwrap(result, axis=0)

    return result, freqs, t



# @docstring.dedent_interpd
def specgram(x, NFFT=None, Fs=None, detrend=None, window=None,
             noverlap=None, pad_to=None, sides=None, scale_by_freq=None,
             mode=None):
    """
    Compute a spectrogram.

    Compute and plot a spectrogram of data in x.  Data are split into
    NFFT length segments and the spectrum of each section is
    computed.  The windowing function window is applied to each
    segment, and the amount of overlap of each segment is
    specified with noverlap.

    Parameters
    ----------
    x : array_like
        1-D array or sequence.

    %(Spectral)s

    %(PSD)s

    noverlap : int, optional
        The number of points of overlap between blocks.  The default
        value is 128.
    mode : str, optional
        What sort of spectrum to use, default is 'psd'.
            'psd'
                Returns the power spectral density.

            'complex'
                Returns the complex-valued frequency spectrum.

            'magnitude'
                Returns the magnitude spectrum.

            'angle'
                Returns the phase spectrum without unwrapping.

            'phase'
                Returns the phase spectrum with unwrapping.

    Returns
    -------
    spectrum : array_like
        2-D array, columns are the periodograms of successive segments.

    freqs : array_like
        1-D array, frequencies corresponding to the rows in *spectrum*.

    t : array_like
        1-D array, the times corresponding to midpoints of segments
        (i.e the columns in *spectrum*).

    See Also
    --------
    psd : differs in the overlap and in the return values.
    complex_spectrum : similar, but with complex valued frequencies.
    magnitude_spectrum : similar single segment when mode is 'magnitude'.
    angle_spectrum : similar to single segment when mode is 'angle'.
    phase_spectrum : similar to single segment when mode is 'phase'.

    Notes
    -----
    detrend and scale_by_freq only apply when *mode* is set to 'psd'.

    """
    if noverlap is None:
        noverlap = 128  # default in _spectral_helper() is noverlap = 0
    if NFFT is None:
        NFFT = 256  # same default as in _spectral_helper()
    if len(x) <= NFFT:
        # cbook._warn_external("Only one segment is calculated since parameter "
        #                      "NFFT (=%d) >= signal length (=%d)." %
        #                      (NFFT, len(x)))
        print("Only one segment is calculated since parameter "
                "NFFT (=%d) >= signal length (=%d)." %
                (NFFT, len(x)))

    spec, freqs, t = _spectral_helper(x=x, y=None, NFFT=NFFT, Fs=Fs,
                                      detrend_func=detrend, window=window,
                                      noverlap=noverlap, pad_to=pad_to,
                                      sides=sides,
                                      scale_by_freq=scale_by_freq,
                                      mode=mode)

    if mode != 'complex':
        spec = spec.real  # Needed since helper implements generically

    return spec, freqs, t
