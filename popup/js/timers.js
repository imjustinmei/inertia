const update = (input) => {
  let value = input.value.replace(/\D/g, '');
  input.value = value.substring(0, 2) + (value.length > 2 ? ':' : '') + value.substring(2);
};

const pad = (input) => {
  let value = input.value.replace(/\D/g, '').padStart(4, '0');
  let time = Math.min(3600, value.substring(0, 2) * 60 + parseInt(value.substring(2)));
  time = Math.max(60, Math.min(3600, value.substring(0, 2) * 60 + parseInt(value.substring(2))));

  input.value = convert(time);
  times[input.id] = current[input.id] = time;
};

const convert = (value) => {
  const mins = Math.floor(value / 60).toString();
  const secs = (value % 60).toString();

  return mins.padStart(2, '0') + ':' + secs.padStart(2, '0');
};

const count = () => {
  current = current.map((time, index) => {
    if (time <= 0 || names[index] == '') return time;
    const next = time - 1;

    document.getElementById(index).value = convert(next);
    return next ? next : times[index];
  });
};
