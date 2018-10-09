import * as types from './mutations-types'

// 点击歌曲播放这一动作涉及到提交多个mutations，因此把他们集合到一个actions里面进行管理
export function toPlay( {commit,state}, {list,index} ) {
	commit( types.SET_PLAYING_STATE, true )
    commit( types.SET_FULL_SCREEN, true )
    commit( types.SET_CURRENT_INDEX, index )
    commit( types.SET_PLAYLIST, list )
    commit( types.SET_SEQUENCE_LIST, list )   
}

// 点击搜索列表的歌曲，会将该歌曲添加到播放列表，也涉及多个mutations
// 此时涉及到三个state的修改
export function searchToPlay( {commit, state}, song ) {
	let playList = state.playList.slice(0)
	let sequenceList = state.sequenceList.slice(0)
	let currentIndex = state.currentIndex
	let currentSong = playList[currentIndex]

	let in_playList_index = findIndex( playList, song ) //这首歌是否已经在当前播放列表，是则in_playList_index > -1

	currentIndex++ //这里需要写currentIndex++（而不是下一句写currentIndex + 1），原先列表为空时才不会bug

	playList.splice( currentIndex, 0, song ) //插入这首歌先,然后判断怎么删除原来已在列表中的歌

	if( in_playList_index > -1 ) {
		if( currentIndex > in_playList_index ) { //说明插入的歌曲在重复歌曲的后面
			playList.splice( in_playList_index, 1 )  //删除前面这首歌
			currentIndex-- //删除后数组长度-1
		}else {
			playList.splice( in_playList_index + 1, 1 )
		}
	}

	let currentSequenceIndex = findIndex( sequenceList, currentSong )  //临时变量

	let in_sequenceList_index = findIndex( sequenceList, song )  //是否在当前列表

	sequenceList.splice( currentSequenceIndex + 1, 0, song )

	if( in_sequenceList_index > -1 ) {
		if( currentSequenceIndex > in_sequenceList_index ) {
			sequenceList.splice( in_sequenceList_index, 1 )
		}else {
			sequenceList.splice( in_sequenceList_index + 1, 1 )
		}
	}

	commit( types.SET_PLAYING_STATE, true )
    commit( types.SET_FULL_SCREEN, true )
    commit( types.SET_CURRENT_INDEX, currentIndex )
    commit( types.SET_PLAYLIST, playList )
    commit( types.SET_SEQUENCE_LIST, sequenceList )  
}

function findIndex( list, song ) {
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

