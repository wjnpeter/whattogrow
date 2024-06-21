function loadScript(src: string, position: any, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

function moonActions(phase: number) {
  if (phase === 0) {
    return [
      'Delay doing anything until a tiny wee fingernail of the moon is actually visible'
    ]
  } else if (phase < 0.25) {
    return [
      'Moonlight is increasing',
      'Strongest gravitational pull',
      'Soil releases / Earth exhales / Energy draws UP into upper planets',
      'Above ground Leaf plants',
      'Graft, Mow lawns & Prune foliage (to increase growth)'
    ]
  } else if (phase === 0.25) {
    return [
      'Above ground annuals, especially Leaf plants'
    ]
  } else if (phase < 0.5) {
    return [
      'Moonlight becomes stronger',
      'Gravitational pull is a little less now',
      'Soil releases / Earth exhales / Energy draws UP into upper planets',
      'Above ground Fruit plants',
      'Graft, Mow lawns & Prune foliage (to increase growth)'
    ]
  } else if (phase === 0.5) {
    return [
      'Time to rest, celebrate and meditate',
      'Gardening is NOT recommended in the 12 hours before the full moon'
    ]
  } else if (phase < 0.75) {
    return [
      'Moonlight is decreasing',
      'Gravitational pull is decreasing',
      'Soil absorbs / Earth inhales / Energy draws DOWN into the Roots',
      'Below ground Root plants such as Potatoes, Carrots & Onions',
      'Harvest crops, Fertilize, Transplant',
      'Mow lawns & Prune foliage (to reduce growth)'
    ]
  } else if (phase === 0.75) {
    return [
      'Below ground plants, especially Root plants'
    ]
  } else if (phase < 1) {
    return [
      'Barren phase',
      'Moonlight has decreased',
      'Gravitational pull has decreased',
      'Soil absorbs / Earth inhales / Energy draws DOWN into the Roots',
      'Harvest and store crops, Fertilize, Transplant, Destroy weed'
    ]
  }


  return null
}

const needLog = true
const log = (x: any) => {
  if (needLog) console.log(x)
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const soilDataType = ['t5', 't10', 't20', 't50', 't1m']

export {
  loadScript,
  monthNames,
  soilDataType,
  weekdayNames,
  moonActions,
  log
}