import {playMode} from '@/common/js/config'
 
const state = {
	rank: {},
	recommend: {},
	singer: {},
	playing: false,
  fullScreen: false,
  playList: [],      //它可以包含三种播放状态（顺序、单曲、随机）
  sequenceList: [],  //默认的播放列表（顺序播放）
  mode: playMode.sequence,
  currentIndex: -1,
  searchHistory: [],
  loveList: [],
  inputPos: false
}

export default state