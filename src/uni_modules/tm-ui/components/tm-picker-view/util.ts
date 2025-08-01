type TM_PICKER_X_ITEM = Record<string, any>
/**
 * 当前树有多少个被选中了。
 */
export function getTreeSelectedNum(item: TM_PICKER_X_ITEM[], target: Set<string>): number {
	let inx = 0;
	function jshz(tree: TM_PICKER_X_ITEM[]) {
		for (let i = 0; i < tree.length; i++) {
			let item = tree[i]
			if (item.children.length > 0) {
				jshz(item.children)
			} else if (target.has(item.id)) {
				inx += 1
			}
		}
	}
	jshz(item)
	return inx;
}

/**
 * 根据目标节点，过滤掉父节点。
 * @param item 
 * @param target 
 */
export function filterParentNode(item: TM_PICKER_X_ITEM[], target: Set<string>): string[] {
	function jshz(tree: TM_PICKER_X_ITEM[]): string[] {
		let arr = [] as string[]
		for (let i = 0; i < tree.length; i++) {
			let item = tree[i]
			if (item.children.length > 0) {
				arr = arr.concat(jshz(item.children))
			} else if (target.has(item.id)) {
				arr.push(item.id)
			}
		}
		return arr;
	}
	return jshz(item)
}

/**
 * 根据给定的长度值，赋值默认值
 */
export function setDefaultByValueAr(list: TM_PICKER_X_ITEM[], value: string[], maxLen: number): string[] {
	let v = value;
	let pr = [] as string[];
	for (let j = 0; j < maxLen; j++) {
		pr.push("")
	}
	v = v.concat(pr).slice(0, maxLen)
	let defaultAr = [] as string[];
	function setvalue(item: TM_PICKER_X_ITEM[]) {
		if (item.length > 0) {
			defaultAr.push(item[0].id);
			if (item[0].children.length > 0) {
				setvalue(item[0].children)
			}
		}
	}

	setvalue(list);

	for (let i = 0; i < maxLen; i++) {
		if (defaultAr.length - 1 >= i && v[i] == "") {
			v[i] = defaultAr[i]
		}
	}


	return v;
}



// 通过 ID 查找节点的函数
export function findNodeById(TreeNode: TM_PICKER_X_ITEM[], id: string): TM_PICKER_X_ITEM | null {
	let newnode = null as TM_PICKER_X_ITEM | null
	for (let i = 0; i < TreeNode.length; i++) {
		let node = TreeNode[i]
		if (node.id === id) {
			newnode = node;
			break;
		}
		if (node.children.length > 0) {
			const foundNode = findNodeById(node.children, id);
			if (foundNode != null) {
				newnode = foundNode;
				break;
			}
		}

	}

	return newnode;
}


// 查找节点的上级节点
export function findParentNode(nodes: TM_PICKER_X_ITEM[], targetNodeId: string): TM_PICKER_X_ITEM | null {
	function search(node: TM_PICKER_X_ITEM): TM_PICKER_X_ITEM | null {
		if (node.children.length > 0) {
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child.id === targetNodeId) {
					return node;
				} else {
					const foundParent = search(child);
					if (foundParent != null) {
						return foundParent;
					}
				}
			}
		}

		return null;
	}

	// 使用for循环遍历根节点数组
	for (let i = 0; i < nodes.length; i++) {
		const root = nodes[i];
		const parentNode = search(root);
		if (parentNode != null) {
			return parentNode;
		}
	}

	return null; // 如果未找到目标节点的父节点，则返回undefined
}