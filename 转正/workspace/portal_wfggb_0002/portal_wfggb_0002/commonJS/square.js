/**
 * ���ʵ��ͼ���Ƿ��ǳ�����
 * _drawMap : ���Ż����Լ�ͼ��(2ά�����ʾ���пɻ�������ֵΪ0��1��0��ʾδ��������1��ʾ�ѻ�������)
 * ���һ������û�л���������Ҳ�᷵��true
 */
function checkSquare(_drawMap) {
	var wMax = _drawMap[0].length;	//����
	var lMax = _drawMap.length;		//����
	var squareInfo = drawSkeleton(_drawMap);
	// ����drawSkeleton�����ĳ������Ƿ���ͼ�ι淶�ģ���ô�����ϵ�ʵ��ͼ��Ӧ�������ڳ������ڵ�����Ϊ1����������Ϊ0
	for (var i=0; i<lMax; i++) {
		for (var j=0; j<wMax; j++) {
			if ((((i < squareInfo.ls || i > squareInfo.le) || (j < squareInfo.ws || j >squareInfo.we)) && _drawMap[i][j] != 0) || 
				(((i >= squareInfo.ls && i <= squareInfo.le) && (j >= squareInfo.ws && j <= squareInfo.we)) && _drawMap[i][j] == 0)) {
				return false;
			}
		}
	}
	return true;
}

/**
 * �������ݷ��ϳ����ι��򣬻��������ε�4������
 * _drawMap : ���Ż����Լ�ͼ��(2ά�����ʾ���пɻ�������ֵΪ0��1��0��ʾδ��������1��ʾ�ѻ�������)
 */
function drawSkeleton(_drawMap) {
	//"grid":[[0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
	iDebug(">>>smile_lc_portal drawSkeleton in _drawMap=" + _drawMap);
	var wMax = _drawMap[0].length;	// ����
	var lMax = _drawMap.length;		// ����
	var squareInfo = {
		divId : 0,
		ws : -1,	// �����ʼ�����±�  
		we : -1,	// ��Ľ��������±�
		ls : -1,	// ������ʼ�����±�  
		le : -1		// ���Ľ��������±�
	};
	// �����������񣬴����Ϸ���1������ʼ���ж�ȡ
	for (var i=0; i<lMax; i++) {
		for (var j=0; j<wMax; j++) {
			// ��һ�ζ�ȡ��1ʱ��ȷ�����������Ϸ��Ķ��������
			if (_drawMap[i][j] != 0 && squareInfo.ws == -1) {//��������
				squareInfo.ws = j;     
				squareInfo.ls = i;     
				// �ӵ�һ�����������ȡ���ٶ���0���߶�����󳤶ȼ���ȷ��squareInfo.le��ȷ�����·����������
				for (var k = i; k<lMax; k++) {//��������
					if ((k < lMax-1 && _drawMap[k+1][j] == 0) || (k == lMax-1 && _drawMap[k][j] > 0)) {
						squareInfo.le = k;   
						break;
					} 
				}
			// �ӵ�һ����������ȡ���ٶ���0���߶�����󳤶�ȷ�������εĿ�ȣ��õ����Ϸ������·����������
			} else if (_drawMap[i][j] == 0 && squareInfo.ws != -1) { //��������
				squareInfo.we = j-1; 
				break;
			}
			if (j == wMax-1 && _drawMap[i][j] != 0) {//���  j�Ѿ��ߵ��� ���ұ�  ���� _drawMap[i][j] != 0  ��ô��Ľ�������Ϊ�������ֵ����ұ�
				squareInfo.we = j;
				break;
			}
		}
		if (squareInfo.le != -1){//��������Ѿ��ҵ��˾ʹ������εĶ�����ȷ�����
			break;
		}
	}
	iDebug(">>>smile_lc_portal drawSkeleton out squareInfo:ws=" + squareInfo.ws + ",we=" + squareInfo.we + ",ls=" + squareInfo.ls + ",le=" + squareInfo.le);		
	return squareInfo;
}

/**
 * ��ҳ���ϻ���ͼ��
 * _drawMap : ���Ż����Լ�ͼ��(2ά�����ʾ���пɻ�������ֵΪ0��1��0��ʾδ��������1��ʾ�ѻ�������)
 * _width����С��Ԫ��Ŀ�
 * _hight����С��Ԫ��ĸ�
 * _cellHigh����Ԫ��֮��ļ��
 * _objId : ������ͼ�ε�id
 * _parentId : Ҫ��ͼ����ӵ��������id
 * _img���õ�Ԫ���Ӧ��ͼƬ
 */
function drawUnit(_drawMap,_width,_hight,_cellHigh, _objId, _parentId,_img) {
	var squareInfo = drawSkeleton(_drawMap);
	var unitInfo = {
		left : squareInfo.ws * (_width + _cellHigh),
		top : squareInfo.ls * (_hight + _cellHigh),
		width : (squareInfo.we - squareInfo.ws + 1) * _width + (squareInfo.we - squareInfo.ws) *_cellHigh,
		height : (squareInfo.le - squareInfo.ls + 1) *_hight + (squareInfo.le - squareInfo.ls) * _cellHigh
	}
	iDebug(">>>smile_lc_portal drawUnit left:"+unitInfo.left + ",top:"+unitInfo.top + ",width:" + unitInfo.width + ",height:"+unitInfo.height + ",_img:" + _img);
	var _str = "<div id=\"" + _objId + "\" style=\"position:absolute; width:" + unitInfo.width + "px; height:" + unitInfo.height + "px; top:" + unitInfo.top + "px; left:" + unitInfo.left + "px;background-image: url("+_img+")\"></div>";
	iDebug(">>>smile_lc_portal drawUnit _str=" + _str);
	document.getElementById(_parentId).innerHTML += _str;
}

